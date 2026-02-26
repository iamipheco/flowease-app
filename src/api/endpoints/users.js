import axiosClient from "../../lib/axiosClient";

export const usersAPI = {
  // GET /users/me
  getCurrentUser: async () => {
    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  // PUT /users/me
  updateProfile: async (data) => {
    const response = await axiosClient.put('/users/me', data);
    return response.data;
  },

  // PUT /users/me/password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await axiosClient.put('/users/me/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // POST /users/me/avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosClient.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // DELETE /users/me/avatar
  deleteAvatar: async () => {
    const response = await axiosClient.delete('/users/me/avatar');
    return response.data;
  },

  // GET /users/:id
  getUserById: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },

  // GET /users/search
  searchUsers: async (query) => {
    const response = await axiosClient.get('/users/search', { params: { q: query } });
    return response.data;
  },

  // DELETE /users/me
  deleteAccount: async () => {
    const response = await axiosClient.delete('/users/me');
    return response.data;
  },
};