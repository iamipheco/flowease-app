import axiosClient from "../../lib/axiosClient";

export const projectsAPI = {
  // GET /projects
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/projects', { params });
    return response.data;
  },

  // POST /projects
  create: async (data) => {
    const response = await axiosClient.post('/projects', data);
    return response.data;
  },

  // GET /projects/:id
  getById: async (id) => {
    const response = await axiosClient.get(`/projects/${id}`);
    return response.data;
  },

  // PUT /projects/:id
  update: async (id, data) => {
    const response = await axiosClient.put(`/projects/${id}`, data);
    return response.data;
  },

  // DELETE /projects/:id
  delete: async (id) => {
    const response = await axiosClient.delete(`/projects/${id}`);
    return response.data;
  },

  // GET /projects/:id/tasks
  getTasks: async (id, params = {}) => {
    const response = await axiosClient.get(`/projects/${id}/tasks`, { params });
    return response.data;
  },

  // GET /projects/:id/stats
  getStats: async (id) => {
    const response = await axiosClient.get(`/projects/${id}/stats`);
    return response.data;
  },

  // GET /projects/:id/members
  getMembers: async (id) => {
    const response = await axiosClient.get(`/projects/${id}/members`);
    return response.data;
  },

  // POST /projects/:id/members
  addMember: async (id, data) => {
    const response = await axiosClient.post(`/projects/:id/members`, data);
    return response.data;
  },

  // DELETE /projects/:id/members/:userId
  removeMember: async (id, userId) => {
    const response = await axiosClient.delete(`/projects/${id}/members/${userId}`);
    return response.data;
  },

  // PUT /projects/:id/members/:userId/role
  updateMemberRole: async (id, userId, role) => {
    const response = await axiosClient.put(`/projects/${id}/members/${userId}/role`, { role });
    return response.data;
  },

  // PUT /projects/:id/archive
  archive: async (id) => {
    const response = await axiosClient.put(`/projects/${id}/archive`);
    return response.data;
  },

  // PUT /projects/:id/restore
  restore: async (id) => {
    const response = await axiosClient.put(`/projects/${id}/restore`);
    return response.data;
  },

  // POST /projects/:id/duplicate
  duplicate: async (id, data) => {
    const response = await axiosClient.post(`/projects/${id}/duplicate`, data);
    return response.data;
  },

  // GET /projects/:id/activity
  getActivity: async (id, params = {}) => {
    const response = await axiosClient.get(`/projects/${id}/activity`, { params });
    return response.data;
  },

  // PUT /projects/:id/favorite
  toggleFavorite: async (id) => {
    const response = await axiosClient.put(`/projects/${id}/favorite`);
    return response.data;
  },

  // GET /projects/favorites
  getFavorites: async () => {
    const response = await axiosClient.get('/projects/favorites');
    return response.data;
  },

  // GET /projects/:id/timeline
  getTimeline: async (id) => {
    const response = await axiosClient.get(`/projects/${id}/timeline`);
    return response.data;
  },
};