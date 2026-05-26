import { API_BASE_URL } from '../../../config/api';


const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getAllBrokers = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/brokers`, {
    headers: getHeaders()
  });
  return response.json();
};

export const getBrokerStats = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/stats`, {
    headers: getHeaders()
  });
  return response.json();
};
