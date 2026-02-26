import axiosClient from "../../lib/axiosClient";

export const workspacesAPI = {
  // GET /workspaces
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/workspaces', { params });
    return response.data;
  },

  // POST /workspaces
  create: async (data) => {
    const response = await axiosClient.post('/workspaces', data);
    return response.data;
  },

  // GET /workspaces/:id
  getById: async (id) => {
    const response = await axiosClient.get(`/workspaces/${id}`);
    return response.data;
  },

  // PUT /workspaces/:id
  update: async (id, data) => {
    const response = await axiosClient.put(`/workspaces/${id}`, data);
    return response.data;
  },

  // DELETE /workspaces/:id
  delete: async (id) => {
    const response = await axiosClient.delete(`/workspaces/${id}`);
    return response.data;
  },

  // GET /workspaces/:id/stats
  getStats: async (id) => {
    const response = await axiosClient.get(`/workspaces/${id}/stats`);
    return response.data;
  },

  // GET /workspaces/:id/members
  getMembers: async (id) => {
    const response = await axiosClient.get(`/workspaces/${id}/members`);
    return response.data;
  },

  // POST /workspaces/:id/members
  addMember: async (id, data) => {
    const response = await axiosClient.post(`/workspaces/${id}/members`, data);
    return response.data;
  },

  // DELETE /workspaces/:id/members/:userId
  removeMember: async (id, userId) => {
    const response = await axiosClient.delete(`/workspaces/${id}/members/${userId}`);
    return response.data;
  },

  // PUT /workspaces/:id/members/:userId/role
  updateMemberRole: async (id, userId, role) => {
    const response = await axiosClient.put(`/workspaces/${id}/members/${userId}/role`, { role });
    return response.data;
  },

  // POST /workspaces/:id/leave
  leaveWorkspace: async (id) => {
    const response = await axiosClient.post(`/workspaces/${id}/leave`);
    return response.data;
  },

  // PUT /workspaces/:id/archive
  archive: async (id) => {
    const response = await axiosClient.put(`/workspaces/${id}/archive`);
    return response.data;
  },

  // PUT /workspaces/:id/restore
  restore: async (id) => {
    const response = await axiosClient.put(`/workspaces/${id}/restore`);
    return response.data;
  },

  // POST /workspaces/:id/logo
  uploadLogo: async (id, file) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await axiosClient.post(`/workspaces/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // GET /workspaces/:id/activity
  getActivity: async (id, params = {}) => {
    const response = await axiosClient.get(`/workspaces/${id}/activity`, { params });
    return response.data;
  },
};