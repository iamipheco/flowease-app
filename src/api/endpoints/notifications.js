import axiosClient from "../../lib/axiosClient";

export const notificationsAPI = {
  // GET /notifications
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/notifications', { params });
    return response.data;
  },

  // GET /notifications/unread-count
  getUnreadCount: async () => {
    const response = await axiosClient.get('/notifications/unread-count');
    return response.data;
  },

  // GET /notifications/:id
  getById: async (id) => {
    const response = await axiosClient.get(`/notifications/${id}`);
    return response.data;
  },

  // PUT /notifications/:id/read
  markAsRead: async (id) => {
    const response = await axiosClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  // PUT /notifications/read-all
  markAllAsRead: async () => {
    const response = await axiosClient.put('/notifications/read-all');
    return response.data;
  },

  // DELETE /notifications/:id
  delete: async (id) => {
    const response = await axiosClient.delete(`/notifications/${id}`);
    return response.data;
  },

  // DELETE /notifications/clear-all
  clearAll: async () => {
    const response = await axiosClient.delete('/notifications/clear-all');
    return response.data;
  },

  // PUT /notifications/settings
  updateSettings: async (settings) => {
    const response = await axiosClient.put('/notifications/settings', settings);
    return response.data;
  },
};