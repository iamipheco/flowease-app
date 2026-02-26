import axiosClient from "../../lib/axiosClient";

export const sectionsAPI = {
  // GET /sections
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/sections', { params });
    return response.data;
  },

  // POST /sections
  create: async (data) => {
    const response = await axiosClient.post('/sections', data);
    return response.data;
  },

  // GET /sections/:id
  getById: async (id) => {
    const response = await axiosClient.get(`/sections/${id}`);
    return response.data;
  },

  // PUT /sections/:id
  update: async (id, data) => {
    const response = await axiosClient.put(`/sections/${id}`, data);
    return response.data;
  },

  // DELETE /sections/:id
  delete: async (id) => {
    const response = await axiosClient.delete(`/sections/${id}`);
    return response.data;
  },

  // PUT /sections/:id/reorder
  reorder: async (id, order) => {
    const response = await axiosClient.put(`/sections/${id}/reorder`, { order });
    return response.data;
  },

  // POST /sections/:id/duplicate
  duplicate: async (id) => {
    const response = await axiosClient.post(`/sections/${id}/duplicate`);
    return response.data;
  },

  // PUT /sections/:id/archive
  archive: async (id) => {
    const response = await axiosClient.put(`/sections/${id}/archive`);
    return response.data;
  },

  // PUT /sections/:id/restore
  restore: async (id) => {
    const response = await axiosClient.put(`/sections/${id}/restore`);
    return response.data;
  },

  // GET /sections/:id/tasks
  getTasks: async (id) => {
    const response = await axiosClient.get(`/sections/${id}/tasks`);
    return response.data;
  },
};