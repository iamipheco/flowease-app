import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workspacesAPI } from '../api';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useAuthStore } from '../store/authStore';

export const useWorkspaces = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { activeWorkspace, setActiveWorkspace, setWorkspaces } = useWorkspaceStore();

  // Get all workspaces
  const {
    data: workspaces,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['workspaces', user?._id],
    queryFn: async () => {
      console.log('🔄 Fetching workspaces...');
      const response = await workspacesAPI.getAll();
      const workspacesList = Array.isArray(response.data) ? response.data : [];
      
      console.log('✅ Workspaces fetched:', workspacesList.length);
      
      // Store workspaces in zustand
      setWorkspaces(workspacesList);
      
      // If no active workspace, select first one
      if (!activeWorkspace && workspacesList.length > 0) {
        console.log('📌 Auto-selecting first workspace:', workspacesList[0].name);
        setActiveWorkspace(workspacesList[0]);
      }
      
      return workspacesList;
    },
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
  });

  // Create workspace
  const createWorkspaceMutation = useMutation({
    mutationFn: workspacesAPI.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setActiveWorkspace(response.data);
      toast.success(`Workspace "${response.data.name}" created`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create workspace');
    },
  });

  // Update workspace
  const updateWorkspaceMutation = useMutation({
    mutationFn: ({ id, data }) => workspacesAPI.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      if (activeWorkspace?._id === response.data._id) {
        setActiveWorkspace(response.data);
      }
      toast.success('Workspace updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update workspace');
    },
  });

  // Delete workspace
  const deleteWorkspaceMutation = useMutation({
    mutationFn: workspacesAPI.delete,
    onSuccess: (response, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      
      // If deleted active workspace, clear it
      if (activeWorkspace?._id === workspaceId) {
        const remaining = workspaces?.filter(w => w._id !== workspaceId) || [];
        if (remaining.length > 0) {
          setActiveWorkspace(remaining[0]);
        } else {
          setActiveWorkspace(null);
        }
      }
      
      toast.success('Workspace deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete workspace');
    },
  });

  // Switch workspace
  const switchWorkspace = (workspaceId) => {
    const workspace = workspaces?.find((w) => w._id === workspaceId);
    if (workspace) {
      console.log('🔄 Switching to:', workspace.name);
      setActiveWorkspace(workspace);
      toast.success(`Switched to ${workspace.name}`);
    }
  };

  return {
    workspaces: Array.isArray(workspaces) ? workspaces : [],
    activeWorkspace,
    isLoading,
    error,
    createWorkspace: createWorkspaceMutation.mutate,
    updateWorkspace: updateWorkspaceMutation.mutate,
    deleteWorkspace: deleteWorkspaceMutation.mutate,
    switchWorkspace,
    isCreating: createWorkspaceMutation.isPending,
    isUpdating: updateWorkspaceMutation.isPending,
    isDeleting: deleteWorkspaceMutation.isPending,
  };
};