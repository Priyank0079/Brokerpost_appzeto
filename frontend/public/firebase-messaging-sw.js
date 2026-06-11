// firebase-messaging-sw.js
// This file MUST be at the root of the public folder so the browser can register it.
// It handles background push notifications when the tab is not in focus.

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Firebase config — hardcoded here because service workers cannot access import.meta.env
// These are safe to expose (they are public client-side keys)
firebase.initializeApp({
  apiKey: "AIzaSyAJ5vXFwAyGaUJdM-wsm67gADqeEFwB5cw",
  authDomain: "brokerspost-1e160.firebaseapp.com",
  projectId: "brokerspost-1e160",
  storageBucket: "brokerspost-1e160.firebasestorage.app",
  messagingSenderId: "122676524822",
  appId: "1:122676524822:web:487510fcbe04a1a5ed8237",
  measurementId: "G-3V668Q4P4X"
});

const messaging = firebase.messaging();

// Handle background messages (when the browser tab is hidden or closed)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'BrokersPost Notification';
  const notificationBody = payload.notification?.body || 'You have a new notification.';
  const notificationUrl = payload.data?.url || '/dashboard/notifications';

  const notificationOptions = {
    body: notificationBody,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: payload.data?.type || 'general', // Prevents duplicate notifications of same type
    data: {
      url: notificationUrl,
      ...payload.data
    },
    requireInteraction: false, // Auto-dismiss after a few seconds
    actions: [
      { action: 'view', title: 'View', icon: '/favicon.svg' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — navigate to the appropriate page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard/notifications';
  const fullUrl = new URL(urlToOpen, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus an existing tab if one is open at the target URL
      for (const client of clientList) {
        if (client.url === fullUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(fullUrl);
      }
    })
  );
});
