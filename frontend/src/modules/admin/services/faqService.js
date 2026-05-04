import { API_BASE_URL } from '../../../config/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getFAQs = async () => {
  const response = await fetch(`${API_BASE_URL}/faqs`);
  return response.json();
};

export const getAdminFAQs = async () => {
  const response = await fetch(`${API_BASE_URL}/faqs/admin`, {
    headers: getHeaders()
  });
  return response.json();
};

export const createFAQ = async (faqData) => {
  const response = await fetch(`${API_BASE_URL}/faqs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(faqData)
  });
  return response.json();
};

export const updateFAQ = async (id, faqData) => {
  const response = await fetch(`${API_BASE_URL}/faqs/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(faqData)
  });
  return response.json();
};

export const deleteFAQ = async (id) => {
  const response = await fetch(`${API_BASE_URL}/faqs/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};
