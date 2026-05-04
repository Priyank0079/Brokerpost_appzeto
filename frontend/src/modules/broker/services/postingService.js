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


// ── CREATE ─────────────────────────────────────────────────────────────────
export const createPosting = async (data) => {
  const res = await fetch(`${API_BASE}/postings`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// ── READ ALL (with optional filter query params) ────────────────────────────
// params: { vertical, postType, intent, subType, location, bedrooms,
//           constructionStatus, occupancy, page, limit }
export const getPostings = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  ).toString();
  const res = await fetch(`${API_BASE}/postings${query ? `?${query}` : ''}`, {
    headers: authHeader()
  });
  return res.json();
};

// ── READ MY POSTINGS ────────────────────────────────────────────────────────
export const getMyPostings = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  ).toString();
  const res = await fetch(`${API_BASE}/postings/my${query ? `?${query}` : ''}`, {
    headers: authHeader()
  });
  return res.json();
};

// ── READ ONE ────────────────────────────────────────────────────────────────
export const getPostingById = async (id) => {
  const res = await fetch(`${API_BASE}/postings/${id}`, {
    headers: authHeader()
  });
  return res.json();
};

// ── UPDATE ──────────────────────────────────────────────────────────────────
// Only updatable fields (classification keys are immutable — create new instead)
export const updatePosting = async (id, data) => {
  const res = await fetch(`${API_BASE}/postings/${id}`, {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// ── DELETE (soft) ───────────────────────────────────────────────────────────
export const deletePosting = async (id) => {
  const res = await fetch(`${API_BASE}/postings/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  return res.json();
};

// ── UPLOAD IMAGES ──────────────────────────────────────────────────────────
export const uploadPropertyImages = async (files) => {
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append('images', file);
  });

  const res = await fetch(`${API_BASE}/upload/property`, {
    method: 'POST',
    headers: authHeader(false),
    body: formData
  });
  return res.json();
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/upload/profile`, {
    method: 'POST',
    headers: authHeader(false),
    body: formData
  });
  return res.json();
};
