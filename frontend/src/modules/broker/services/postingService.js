import { API_BASE_URL as API_BASE } from '../../../config/api';

const authHeader = (includeContentType = true) => {
  const isAdminApp = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const token = localStorage.getItem(isAdminApp ? 'admin_token' : 'token');
  const headers = {};
  if (includeContentType) headers['Content-Type'] = 'application/json';
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  headers['Pragma'] = 'no-cache';
  headers['Expires'] = '0';
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
  const queryObj = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));
  queryObj.t = Date.now();
  const query = new URLSearchParams(queryObj).toString();
  const res = await fetch(`${API_BASE}/postings?${query}`, {
    headers: authHeader(),
    cache: 'no-store'
  });
  return res.json();
};

// ── READ MY POSTINGS ────────────────────────────────────────────────────────
export const getMyPostings = async (params = {}) => {
  if (params.isActive === undefined) {
    params.isActive = true;
  }
  const queryObj = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));
  queryObj.t = Date.now();
  const query = new URLSearchParams(queryObj).toString();
  const res = await fetch(`${API_BASE}/postings/my?${query}`, {
    headers: authHeader(),
    cache: 'no-store'
  });
  return res.json();
};

// ── READ DASHBOARD STATS ────────────────────────────────────────────────────
export const getPostingStats = async () => {
  const res = await fetch(`${API_BASE}/postings/stats?t=${Date.now()}`, {
    headers: authHeader(),
    cache: 'no-store'
  });
  const data = await res.json();
  // Return proper structure even on error
  if (!res.ok) {
    return { success: false, message: data.message || 'Request failed', data: null };
  }
  return data;
};

// ── READ ONE ────────────────────────────────────────────────────────────────
export const getPostingById = async (id) => {
  const res = await fetch(`${API_BASE}/postings/${id}?t=${Date.now()}`, {
    headers: authHeader(),
    cache: 'no-store'
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

export const uploadPropertyVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file);

  const res = await fetch(`${API_BASE}/upload/video`, {
    method: 'POST',
    headers: authHeader(false),
    body: formData
  });
  return res.json();
};
