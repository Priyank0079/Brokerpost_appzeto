import { API_BASE_URL as API_BASE } from '../../../config/api';

const authHeader = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (includeContentType) headers['Content-Type'] = 'application/json';
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ── GET CATEGORIES ────────────────────────────────────────────────────────
export const getCategories = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/categories?${query}`, {
    headers: authHeader()
  });
  return res.json();
};
