import { API_BASE_URL } from '../config/api';


const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
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
