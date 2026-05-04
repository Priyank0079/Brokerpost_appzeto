import { api } from '../../broker/services/api';

export const getLandingConfig = async () => {
  try {
    const response = await api.get('/landing-config');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateLandingConfig = async (configData) => {
  try {
    const response = await api.put('/landing-config', configData);
    return response;
  } catch (error) {
    throw error;
  }
};
