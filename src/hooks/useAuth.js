import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from '../api';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, logout: logoutStore, user, isAuthenticated } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      console.log('✅ Login response:', response);
      console.log('✅ Response data:', response.data);
      
      // Backend sends: { success, message, accessToken, refreshToken, user }
      const { user: userData, accessToken, refreshToken } = response.data;
      
      console.log('👤 User:', userData);
      console.log('🔑 Token:', accessToken);
      console.log('🔄 Refresh:', refreshToken);
      
      if (!userData || !accessToken) {
        console.error('❌ Invalid response structure');
        toast.error('Login failed - Invalid response from server');
        return;
      }
      
      // Store auth data
      setAuth(userData, accessToken, refreshToken);
      
      console.log('✅ Auth stored successfully');
      
      toast.success(`Welcome back, ${userData.name}!`);
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      console.log('✅ Register response:', response);
      
      const { user: userData, accessToken, refreshToken } = response.data;
      
      if (!userData || !accessToken) {
        console.error('❌ Invalid response structure');
        toast.error('Registration failed - Invalid response from server');
        return;
      }
      
      setAuth(userData, accessToken, refreshToken);
      toast.success(`Welcome, ${userData.name}!`);
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('❌ Register error:', error);
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
    },
  });

  // Simple logout
  const logout = async () => {
    console.log('🚪 Logging out...');
    
    // Try backend logout (don't wait)
    authAPI.logout().catch(err => {
      console.warn('⚠️ Backend logout failed (continuing):', err.message);
    });
    
    // Clear local state
    logoutStore();
    queryClient.clear();
    navigate('/login');
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