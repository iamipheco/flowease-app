import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWorkspaceStore = create(
  persist(
    (set) => ({
      activeWorkspace: null,
      workspaces: [],

      setActiveWorkspace: (workspace) => {
        console.log('✅ Setting active workspace:', workspace?.name);
        set({ activeWorkspace: workspace });
      },

      setWorkspaces: (workspaces) => {
        console.log('✅ Setting workspaces:', workspaces?.length);
        set({ workspaces });
      },

      clearWorkspace: () => {
        console.log('✅ Clearing workspace');
        set({ activeWorkspace: null, workspaces: [] });
      },
    }),
    {
      name: 'workspace-storage',
      partialize: (state) => ({
        activeWorkspace: state.activeWorkspace, // Store full workspace object
      }),
    }
  )
);