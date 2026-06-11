import { useEffect, useRef } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getMessagingInstance } from '../config/firebase';
import { registerFcmToken, unregisterFcmToken } from '../modules/broker/services/fcmService';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * useFCM — Custom hook to:
 * 1. Request notification permission from the browser
 * 2. Obtain an FCM token and register it with the backend
 * 3. Listen for foreground messages and show a toast/alert
 *
 * Call this hook ONCE after the user is authenticated (e.g. in AuthContext or App).
 *
 * @param {boolean} isAuthenticated - Only runs when the user is logged in
 * @param {function} [onForegroundMessage] - Optional callback for foreground notifications
 *   Receives the FCM message payload: { notification: { title, body }, data }
 */
const useFCM = (isAuthenticated, onForegroundMessage) => {
  const unsubscribeRef = useRef(null);
  const tokenRegisteredRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Cleanup listener when user logs out
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      // Unregister token from backend when user logs out
      if (tokenRegisteredRef.current) {
        const cleanupToken = async () => {
          try {
            const messaging = await getMessagingInstance();
            if (messaging) {
              const token = await getToken(messaging, { vapidKey: VAPID_KEY }).catch(() => null);
              if (token) {
                await unregisterFcmToken(token);
              }
            }
          } catch (e) {
            console.error('[FCM] cleanup error:', e.message);
          }
        };
        cleanupToken();
      }
      
      tokenRegisteredRef.current = false;
      return;
    }

    const initFCM = async () => {
      try {
        // 1. Get the messaging instance (null if browser doesn't support it)
        const messaging = await getMessagingInstance();
        if (!messaging) {
          console.log('[FCM] Push notifications not supported in this browser.');
          return;
        }

        // 2. Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('[FCM] Notification permission denied by user.');
          return;
        }

        // 3. Get FCM token
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (!token) {
          console.warn('[FCM] No token received. Check VAPID key and service worker registration.');
          return;
        }

        // 4. Register token with backend (only once per session)
        if (!tokenRegisteredRef.current) {
          await registerFcmToken(token, 'web');
          tokenRegisteredRef.current = true;
        }

        // 5. Set up foreground message listener
        if (unsubscribeRef.current) {
          unsubscribeRef.current(); // Clean up previous listener
        }

        unsubscribeRef.current = onMessage(messaging, (payload) => {
          console.log('[FCM] Foreground message received:', payload);

          // Use the provided callback, or fall back to a browser notification
          if (onForegroundMessage) {
            onForegroundMessage(payload);
          } else {
            // Default: show a simple browser notification for foreground messages
            const title = payload.notification?.title || 'BrokersPost';
            const body = payload.notification?.body || 'You have a new notification.';

            // 1. Show OS-level notification
            if (Notification.permission === 'granted') {
              new Notification(title, {
                body,
                icon: '/favicon.svg',
                tag: payload.data?.type || 'general'
              });
            }

            // 2. Show In-App Visual Toast Popup
            const toast = document.createElement('div');
            toast.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: white;
              color: #1e3a5f;
              padding: 16px;
              border-radius: 12px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
              z-index: 99999;
              display: flex;
              flex-direction: column;
              gap: 4px;
              width: 320px;
              border-left: 4px solid #c8962a;
              transform: translateX(120%);
              transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
              cursor: pointer;
            `;

            toast.innerHTML = `
              <div style="font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>${title}</span>
                <button id="close-toast" style="background:none; border:none; color:#9ca3af; cursor:pointer; font-size:16px;">&times;</button>
              </div>
              <div style="font-size: 13px; color: #4b5563; line-height: 1.4;">
                ${body}
              </div>
            `;

            // Click to navigate
            toast.addEventListener('click', (e) => {
              if (e.target.id === 'close-toast') return;
              if (payload.data?.url) {
                window.location.href = payload.data.url;
              }
            });

            // Close button
            toast.querySelector('#close-toast').addEventListener('click', () => {
              toast.style.transform = 'translateX(120%)';
              setTimeout(() => toast.remove(), 400);
            });

            document.body.appendChild(toast);

            // Animate in
            requestAnimationFrame(() => {
              toast.style.transform = 'translateX(0)';
            });

            // Auto-remove after 6 seconds
            setTimeout(() => {
              if (document.body.contains(toast)) {
                toast.style.transform = 'translateX(120%)';
                setTimeout(() => {
                  if (document.body.contains(toast)) toast.remove();
                }, 400);
              }
            }, 6000);
          }
        });

      } catch (error) {
        // Non-fatal — don't crash the app if FCM fails
        console.error('[FCM] Initialization error:', error.message);
      }
    };

    initFCM();

    // Cleanup on unmount or when isAuthenticated changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isAuthenticated]);
};

export default useFCM;
