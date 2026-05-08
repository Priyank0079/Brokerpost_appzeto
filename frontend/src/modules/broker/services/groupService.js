import { api } from './api';

export const getGroups = async () => {
  return api.get('/groups');
};

export const getGroupDetails = async (id) => {
  return api.get(`/groups/${id}`);
};
