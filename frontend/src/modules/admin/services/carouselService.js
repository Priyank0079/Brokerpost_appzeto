import { API_BASE_URL } from '../../../config/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getCarousels = async () => {
  const response = await fetch(`${API_BASE_URL}/banners`);
  return response.json();
};

export const createCarousel = async (carouselData) => {
  const response = await fetch(`${API_BASE_URL}/banners`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(carouselData)
  });
  return response.json();
};

export const updateCarousel = async (id, carouselData) => {
  const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(carouselData)
  });
  return response.json();
};

export const deleteCarousel = async (id) => {
  const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};


export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  return response.json();
};
