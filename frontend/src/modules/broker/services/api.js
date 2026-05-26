import { API_BASE_URL } from '../../../config/api';

const getHeaders = (contentType = 'application/json') => {
  const isAdminApp = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const token = localStorage.getItem(isAdminApp ? 'admin_token' : 'token');
  const headers = {};
  if (contentType) headers['Content-Type'] = contentType;
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  headers['Pragma'] = 'no-cache';
  headers['Expires'] = '0';
  return headers;
};

export const api = {
  get: async (endpoint) => {
    const separator = endpoint.includes('?') ? '&' : '?';
    const response = await fetch(`${API_BASE_URL}${endpoint}${separator}t=${Date.now()}`, {
      headers: getHeaders(null),
      cache: 'no-store'
    });
    const data = await response.json();
    // Return proper structure even on error
    if (!response.ok) {
      return { success: false, message: data.message || 'Request failed', data: null };
    }
    return data;
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },
  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },
  patch: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(null)
    });
    return response.json();
  }
};
