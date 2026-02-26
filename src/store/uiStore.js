import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set, get) => ({
      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),
      openSidebar: () => set({ isSidebarOpen: true }),

      // Mobile menu
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        
        // Update document class
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Modals
      activeModal: null,
      openModal: (modalName) => set({ activeModal: modalName }),
      closeModal: () => set({ activeModal: null }),

      // Loading states
      isGlobalLoading: false,
      setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        theme: state.theme,
      }),
    }
  )
);