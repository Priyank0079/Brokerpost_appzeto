import { API_BASE_URL as API_BASE } from '../../../config/api';

const authHeader = (includeContentType = true) => {
  const isAdminApp = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const token = localStorage.getItem(isAdminApp ? 'admin_token' : 'token');
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

// ── CREATE CATEGORY ───────────────────────────────────────────────────────
export const createCategory = async (data) => {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// ── UPDATE CATEGORY ───────────────────────────────────────────────────────
export const updateCategory = async (id, data) => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// ── DELETE CATEGORY ───────────────────────────────────────────────────────
export const deleteCategory = async (id) => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  return res.json();
};
