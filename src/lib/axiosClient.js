import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useAuthStore } from '../store/authStore';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// =========================
// REQUEST INTERCEPTOR
// =========================
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      useAuthStore.getState().logout();
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        { refreshToken }
      );

      const { accessToken: newAccessToken } = response.data;

      // ✅ Update Zustand properly
      const { user, refreshToken: storedRefresh } = useAuthStore.getState();

      useAuthStore.getState().setAuth(
        user,
        newAccessToken,
        storedRefresh
      );

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      isRefreshing = false;

      return axiosClient(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;

      // ✅ Proper logout (NO RELOAD)
      useAuthStore.getState().logout();

      return Promise.reject(refreshError);
    }
  }
);

export default axiosClient;