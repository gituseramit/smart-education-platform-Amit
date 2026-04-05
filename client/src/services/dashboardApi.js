import api from './api';

export const dashboardApi = {
  getStudentDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  getMentorDashboard: async () => {
    const response = await api.get('/dashboard/mentor');
    return response.data;
  },
  getCounselorDashboard: async () => {
    const response = await api.get('/dashboard/counselor');
    return response.data;
  },
  getActivity: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  },
  getProgress: async () => {
    const response = await api.get('/dashboard/progress');
    return response.data;
  }
};

export default dashboardApi;
