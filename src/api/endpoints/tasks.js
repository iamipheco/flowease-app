import axiosClient from "../../lib/axiosClient";

export const tasksAPI = {
  // GET /tasks
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/tasks', { params });
    return response.data;
  },

  // POST /tasks
  create: async (data) => {
    const response = await axiosClient.post('/tasks', data);
    return response.data;
  },

  // GET /tasks/:id
  getById: async (id) => {
    const response = await axiosClient.get(`/tasks/${id}`);
    return response.data;
  },

  // PUT /tasks/:id
  update: async (id, data) => {
    const response = await axiosClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  // DELETE /tasks/:id
  delete: async (id) => {
    const response = await axiosClient.delete(`/tasks/${id}`);
    return response.data;
  },

  // PUT /tasks/:id/complete
  complete: async (id) => {
    const response = await axiosClient.put(`/tasks/${id}/complete`);
    return response.data;
  },

  // PUT /tasks/:id/reopen
  reopen: async (id) => {
    const response = await axiosClient.put(`/tasks/${id}/reopen`);
    return response.data;
  },

  // POST /tasks/:id/duplicate
  duplicate: async (id) => {
    const response = await axiosClient.post(`/tasks/${id}/duplicate`);
    return response.data;
  },

  // PUT /tasks/:id/archive
  archive: async (id) => {
    const response = await axiosClient.put(`/tasks/${id}/archive`);
    return response.data;
  },

  // PUT /tasks/:id/restore
  restore: async (id) => {
    const response = await axiosClient.put(`/tasks/${id}/restore`);
    return response.data;
  },

  // POST /tasks/:id/assign
  assignUsers: async (id, userIds) => {
    const response = await axiosClient.post(`/tasks/${id}/assign`, { userIds });
    return response.data;
  },

  // DELETE /tasks/:id/assign/:userId
  unassignUser: async (id, userId) => {
    const response = await axiosClient.delete(`/tasks/${id}/assign/${userId}`);
    return response.data;
  },

  // GET /tasks/:id/comments
  getComments: async (id) => {
    const response = await axiosClient.get(`/tasks/${id}/comments`);
    return response.data;
  },

  // POST /tasks/:id/comments
  addComment: async (id, text) => {
    const response = await axiosClient.post(`/tasks/${id}/comments`, { text });
    return response.data;
  },

  // PUT /tasks/:id/comments/:commentId
  updateComment: async (id, commentId, text) => {
    const response = await axiosClient.put(`/tasks/${id}/comments/${commentId}`, { text });
    return response.data;
  },

  // DELETE /tasks/:id/comments/:commentId
  deleteComment: async (id, commentId) => {
    const response = await axiosClient.delete(`/tasks/${id}/comments/${commentId}`);
    return response.data;
  },

  // GET /tasks/:id/attachments
  getAttachments: async (id) => {
    const response = await axiosClient.get(`/tasks/${id}/attachments`);
    return response.data;
  },

  // POST /tasks/:id/attachments
  uploadAttachment: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post(`/tasks/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // DELETE /tasks/:id/attachments/:attachmentId
  deleteAttachment: async (id, attachmentId) => {
    const response = await axiosClient.delete(`/tasks/${id}/attachments/${attachmentId}`);
    return response.data;
  },

  // GET /tasks/:id/subtasks
  getSubtasks: async (id) => {
    const response = await axiosClient.get(`/tasks/${id}/subtasks`);
    return response.data;
  },

  // POST /tasks/:id/subtasks
  createSubtask: async (id, data) => {
    const response = await axiosClient.post(`/tasks/${id}/subtasks`, data);
    return response.data;
  },

  // GET /tasks/:id/activity
  getActivity: async (id) => {
    const response = await axiosClient.get(`/tasks/${id}/activity`);
    return response.data;
  },

  // POST /tasks/bulk
  bulkCreate: async (tasks) => {
    const response = await axiosClient.post('/tasks/bulk', { tasks });
    return response.data;
  },

  // PUT /tasks/bulk/update
  bulkUpdate: async (taskIds, updates) => {
    const response = await axiosClient.put('/tasks/bulk/update', { taskIds, updates });
    return response.data;
  },

  // DELETE /tasks/bulk/delete
  bulkDelete: async (taskIds) => {
    const response = await axiosClient.delete('/tasks/bulk/delete', { data: { taskIds } });
    return response.data;
  },
};