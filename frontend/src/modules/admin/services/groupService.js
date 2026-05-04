import { API_BASE_URL } from '../../../config/api';


const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getGroups = async () => {
  const response = await fetch(`${API_BASE_URL}/groups`, {
    headers: getHeaders()
  });
  return response.json();
};

export const getGroup = async (id) => {
  const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
    headers: getHeaders()
  });
  return response.json();
};

export const createGroup = async (groupData) => {

  const response = await fetch(`${API_BASE_URL}/groups`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(groupData)
  });
  return response.json();
};

export const deleteGroup = async (id) => {
  const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};

export const addGroupMembers = async (groupId, memberIds) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ memberIds })
  });
  return response.json();
};
export const removeGroupMember = async (groupId, memberId) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members/${memberId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};
