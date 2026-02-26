import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user }),
      
      setToken: (token) => {
        set({ token });
        localStorage.setItem('accessToken', token);
      },
      
      setAuth: (user, token, refreshToken) => {
        
        // Normalize user object - backend sends 'id', but we need '_id'
        const normalizedUser = {
          ...user,
          _id: user._id || user.id, // Handle both formats
        };
        
        set({
          user: normalizedUser,
          token,
          refreshToken,
          isAuthenticated: true,
        });
        
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
      
      },

      logout: () => {
       
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        
        // Only clear auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('auth-storage');
        
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);