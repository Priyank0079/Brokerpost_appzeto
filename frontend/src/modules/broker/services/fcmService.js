import { API_BASE_URL } from '../../../config/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Register an FCM token with the backend.
 * @param {string} token - The FCM token from Firebase
 * @param {string} [device='web'] - Device type identifier
 */
export const registerFcmToken = async (token, device = 'web') => {
  try {
    const res = await fetch(`${API_BASE_URL}/fcm/token`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ token, device })
    });
    const data = await res.json();
    if (data.success) {
      console.log('[FCM] Token registered with backend');
    } else {
      console.warn('[FCM] Backend rejected token:', data.message);
    }
  } catch (err) {
    console.error('[FCM] Failed to register token with backend:', err.message);
  }
};

/**
 * Unregister (remove) an FCM token from the backend.
 * Called on user logout.
 * @param {string} token - The FCM token to remove
 */
export const unregisterFcmToken = async (token) => {
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE_URL}/fcm/token`, {
      method: 'DELETE',
      headers: authHeader(),
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (data.success) {
      console.log('[FCM] Token unregistered from backend');
    }
  } catch (err) {
    console.error('[FCM] Failed to unregister token:', err.message);
  }
};
