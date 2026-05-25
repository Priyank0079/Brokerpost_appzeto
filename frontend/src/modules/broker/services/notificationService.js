import { API_BASE_URL } from '../config/api';


const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/notifications`, {
    headers: getHeaders()
  });
  return response.json();
};

export const markAsRead = async (id) => {
  const response = await fetch(`${API_BASE_URL}/auth/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getHeaders()
  });
  return response.json();
};
