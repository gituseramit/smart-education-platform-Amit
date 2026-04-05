import api from './api';

export const internshipApi = {
  getAllInternships: async (params = {}) => {
    const response = await api.get('/internships', { params });
    return response.data;
  },
  getInternshipById: async (id) => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
  },
  applyToInternship: async (id, resumeURL) => {
    const response = await api.post('/internships/apply', { internshipId: id, resumeURL });
    return response.data;
  },
  getSavedInternships: async () => {
    const response = await api.get('/internships/saved');
    return response.data;
  }
};

export default internshipApi;
