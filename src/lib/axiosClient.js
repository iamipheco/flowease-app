import axios from 'axios';
import { API_URL } from '../utils/constants';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor - Add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', config.url);
    } else {
      console.warn('⚠️ No token found for:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token refresh
axiosClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ Request failed:', originalRequest.url, error.response?.status);

    // If error is not 401 or already retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If we're currently refreshing, queue this request
    if (isRefreshing) {
      console.log('🔄 Queuing request during refresh:', originalRequest.url);
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error('❌ No refresh token available');
      isRefreshing = false;
      
      // Clear everything and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
      
      return Promise.reject(error);
    }

    try {
      console.log('🔄 Attempting token refresh...');

      // Make refresh request WITHOUT the interceptor to avoid infinite loop
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        { refreshToken },
        { baseURL: API_URL }
      );

      const { accessToken: newAccessToken } = response.data;
      
      console.log('✅ Token refreshed successfully');

      // Store new token
      localStorage.setItem('accessToken', newAccessToken);

      // Update auth store
      const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      if (authStorage.state) {
        authStorage.state.token = newAccessToken;
        localStorage.setItem('auth-storage', JSON.stringify(authStorage));
      }

      // Process queued requests
      processQueue(null, newAccessToken);

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      
      isRefreshing = false;

      return axiosClient(originalRequest);

    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);

      // Process queue with error
      processQueue(refreshError, null);
      
      isRefreshing = false;

      // Clear everything and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('auth-storage');
      
      window.location.href = '/login';

      return Promise.reject(refreshError);
    }
  }
);

export default axiosClient;