import axiosClient from "../../lib/axiosClient";

export const milestonesAPI = {
  // GET /milestones
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/milestones', { params });
    return response.data;
  },

  // POST /milestones
  create: async (data) => {
    const response = await axiosClient.post('/milestones', data);
    return response.data;
  },

  // GET /milestones/:id
  getById: async (id) => {
    const response = await axiosClient.get(`/milestones/${id}`);
    return response.data;
  },

  // PUT /milestones/:id
  update: async (id, data) => {
    const response = await axiosClient.put(`/milestones/${id}`, data);
    return response.data;
  },

  // DELETE /milestones/:id
  delete: async (id) => {
    const response = await axiosClient.delete(`/milestones/${id}`);
    return response.data;
  },

  // PUT /milestones/:id/complete
  complete: async (id) => {
    const response = await axiosClient.put(`/milestones/${id}/complete`);
    return response.data;
  },

  // PUT /milestones/:id/reopen
  reopen: async (id) => {
    const response = await axiosClient.put(`/milestones/${id}/reopen`);
    return response.data;
  },

  // GET /milestones/upcoming
  getUpcoming: async (workspaceId) => {
    const response = await axiosClient.get('/milestones/upcoming', {
      params: { workspace: workspaceId },
    });
    return response.data;
  },

  // GET /milestones/overdue
  getOverdue: async (workspaceId) => {
    const response = await axiosClient.get('/milestones/overdue', {
      params: { workspace: workspaceId },
    });
    return response.data;
  },

  // GET /milestones/:id/tasks
  getTasks: async (id) => {
    const response = await axiosClient.get(`/milestones/${id}/tasks`);
    return response.data;
  },

  // GET /milestones/:id/progress
  getProgress: async (id) => {
    const response = await axiosClient.get(`/milestones/${id}/progress`);
    return response.data;
  },

  // PUT /milestones/:id/archive
  archive: async (id) => {
    const response = await axiosClient.put(`/milestones/${id}/archive`);
    return response.data;
  },
};