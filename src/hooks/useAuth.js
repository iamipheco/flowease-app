import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from '../api';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setAuth = useAuthStore(state => state.setAuth);
  const logoutStore = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // ========================
  // LOGIN
  // ========================
  const loginMutation = useMutation({
    mutationFn: authAPI.login,

    onSuccess: (response) => {
      const { user: userData, accessToken, refreshToken } = response.data;

      if (!userData || !accessToken) {
        toast.error('Login failed - Invalid response from server');
        return;
      }

      setAuth(userData, accessToken, refreshToken);

      toast.success(`Welcome back, ${userData.name}!`);
      navigate('/dashboard', { replace: true });
    },
  });

  // ========================
  // REGISTER
  // ========================
  const registerMutation = useMutation({
    mutationFn: authAPI.register,

    onSuccess: (response) => {
      const { user: userData, accessToken, refreshToken } = response.data;

      if (!userData || !accessToken) {
        toast.error('Registration failed - Invalid response from server');
        return;
      }

      setAuth(userData, accessToken, refreshToken);

      toast.success(`Welcome, ${userData.name}!`);
      navigate('/dashboard', { replace: true });
    },
  });

  // ========================
  // LOGOUT
  // ========================
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn('Backend logout failed:', err.message);
    }

    logoutStore();

    // Better than clear()
    queryClient.removeQueries();

    navigate('/login', { replace: true });
    toast.success('Logged out successfully');
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};