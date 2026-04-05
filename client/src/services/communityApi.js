import api from './api';

export const communityApi = {
  getPosts: async () => {
    const response = await api.get('/community/posts');
    return response.data;
  },
  getPostById: async (id) => {
    const response = await api.get(`/community/posts/${id}`);
    return response.data;
  },
  createPost: async (postData) => {
    const response = await api.post('/community/posts', postData);
    return response.data;
  },
  likePost: async (id) => {
    const response = await api.post(`/community/posts/${id}/like`);
    return response.data;
  }
};

export default communityApi;
