import axiosClient from "../../lib/axiosClient";
export const invitationsAPI = {
  // POST /invitations
  send: async (data) => {
    const response = await axiosClient.post('/invitations', data);
    return response.data;
  },

  // POST /invitations/bulk
  sendBulk: async (invitations) => {
    const response = await axiosClient.post('/invitations/bulk', { invitations });
    return response.data;
  },

  // GET /invitations
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/invitations', { params });
    return response.data;
  },

  // GET /invitations/pending
  getPending: async () => {
    const response = await axiosClient.get('/invitations/pending');
    return response.data;
  },

  // GET /invitations/token/:token
  getByToken: async (token) => {
    const response = await axiosClient.get(`/invitations/token/${token}`);
    return response.data;
  },

  // PUT /invitations/:id/accept
  accept: async (id) => {
    const response = await axiosClient.put(`/invitations/${id}/accept`);
    return response.data;
  },

  // PUT /invitations/:id/decline
  decline: async (id) => {
    const response = await axiosClient.put(`/invitations/${id}/decline`);
    return response.data;
  },

  // DELETE /invitations/:id/revoke
  revoke: async (id) => {
    const response = await axiosClient.delete(`/invitations/${id}/revoke`);
    return response.data;
  },

  // POST /invitations/:id/resend
  resend: async (id) => {
    const response = await axiosClient.post(`/invitations/${id}/resend`);
    return response.data;
  },

  // GET /invitations/stats/:workspaceId
  getStats: async (workspaceId) => {
    const response = await axiosClient.get(`/invitations/stats/${workspaceId}`);
    return response.data;
  },
};