const API_BASE_URL = 'https://api.broker.com/v1';

export const api = {
  get: async (endpoint) => {
    // const response = await fetch(`${API_BASE_URL}${endpoint}`);
    // return response.json();
    return { success: true, message: "Mock API Success" };
  },
  post: async (endpoint, data) => {
    return { success: true, message: "Mock API Success" };
  }
};
