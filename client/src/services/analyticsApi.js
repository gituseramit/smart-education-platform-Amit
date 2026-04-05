import api from './api';

export const analyticsApi = {
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  }
};

export default analyticsApi;
