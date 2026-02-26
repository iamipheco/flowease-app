import axiosClient from "../../lib/axiosClient";

const authAPI = {
  // POST /auth/login - User login
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    console.log('Auth API - Login response:', response);
    return response;
  },

  // POST /auth/register - User registration
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    console.log('Auth API - Register response:', response);
    return response;
  },

  // Logout - Simple: Just clear localStorage, no API call needed
  logout: async () => {
    console.log('Logging out - clearing localStorage');
    
    // Clear all localStorage if you want a complete clean slate
     localStorage.clear();
    
    return { 
      data: { 
        success: true, 
        message: 'Logged out successfully' 
      } 
    };
  },

  // POST /auth/refresh - Refresh access token
  refresh: async (refreshToken) => {
    const response = await axiosClient.post('/auth/refresh', { refreshToken });
    return response;
  },

  // GET /auth/me - Get current authenticated user
  getCurrentUser: async () => {
    const response = await axiosClient.get('/auth/me');
    return response;
  },

  // PUT /auth/profile - Update user profile
  updateProfile: async (data) => {
    const response = await axiosClient.put('/auth/profile', data);
    return response;
  },

  // PUT /auth/change-password - Change user password
  changePassword: async (data) => {
    const response = await axiosClient.put('/auth/change-password', data);
    return response;
  },

  // POST /auth/forgot-password - Request password reset
  forgotPassword: async (email) => {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response;
  },

  // POST /auth/reset-password - Reset password with token
  resetPassword: async (data) => {
    const response = await axiosClient.post('/auth/reset-password', data);
    return response;
  },

  // POST /auth/verify-email - Verify email with token
  verifyEmail: async (token) => {
    const response = await axiosClient.post('/auth/verify-email', { token });
    return response;
  },

  // POST /auth/resend-verification - Resend verification email
  resendVerification: async (email) => {
    const response = await axiosClient.post('/auth/resend-verification', { email });
    return response;
  },
};

export default authAPI;