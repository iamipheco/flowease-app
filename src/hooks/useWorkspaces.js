import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workspacesAPI } from '../api';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useAuthStore } from '../store/authStore';

export const useWorkspaces = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { activeWorkspace, setActiveWorkspace, setWorkspaces } = useWorkspaceStore();

  /* =============================
     FETCH ALL WORKSPACES
  ============================== */
  const {
    data: workspaces,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['workspaces', user?._id],
    queryFn: async () => {
      const response = await workspacesAPI.getAll();
      const workspacesList = Array.isArray(response.data) ? response.data : [];

      setWorkspaces(workspacesList);

      if (!activeWorkspace && workspacesList.length > 0) {
        setActiveWorkspace(workspacesList[0]);
      }

      return workspacesList;
    },
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
  });

  /* =============================
     CREATE WORKSPACE
  ============================== */
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

  /* =============================
     UPDATE WORKSPACE
  ============================== */
  const updateWorkspaceMutation = useMutation({
    mutationFn: ({ id, data }) => workspacesAPI.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      if (activeWorkspace?._id === response.data._id) setActiveWorkspace(response.data);
      toast.success('Workspace updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update workspace');
    },
  });

  /* =============================
     UPDATE WORKSPACE GOALS
  ============================== */
  const updateGoalsMutation = useMutation({
    mutationFn: ({ id, dailyGoal, weeklyGoal }) =>
      workspacesAPI.updateGoals(id, { dailyGoal, weeklyGoal }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      if (activeWorkspace?._id === response.data._id) setActiveWorkspace(response.data);
      toast.success('Workspace goals updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update goals');
    },
  });

  /* =============================
     DELETE WORKSPACE
  ============================== */
  const deleteWorkspaceMutation = useMutation({
    mutationFn: workspacesAPI.delete,
    onSuccess: (response, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });

      if (activeWorkspace?._id === workspaceId) {
        const remaining = workspaces?.filter((w) => w._id !== workspaceId) || [];
        setActiveWorkspace(remaining[0] || null);
      }

      toast.success('Workspace deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete workspace');
    },
  });

  /* =============================
     SWITCH WORKSPACE
  ============================== */
  const switchWorkspace = (workspaceId) => {
    const workspace = workspaces?.find((w) => w._id === workspaceId);
    if (workspace) {
      setActiveWorkspace(workspace);
      toast.success(`Switched to ${workspace.name}`);
    }
  };

  /* =============================
     RETURN
  ============================== */
  return {
    workspaces: Array.isArray(workspaces) ? workspaces : [],
    activeWorkspace,
    dailyGoal: activeWorkspace?.dailyGoal ?? 8,
    weeklyGoal: activeWorkspace?.weeklyGoal ?? 40,
    isLoading,
    error,
    createWorkspace: createWorkspaceMutation.mutate,
    updateWorkspace: updateWorkspaceMutation.mutate,
    updateGoals: updateGoalsMutation.mutate, // <== new
    deleteWorkspace: deleteWorkspaceMutation.mutate,
    switchWorkspace,
    isCreating: createWorkspaceMutation.isPending,
    isUpdating: updateWorkspaceMutation.isPending,
    isUpdatingGoals: updateGoalsMutation.isPending, // <== new
    isDeleting: deleteWorkspaceMutation.isPending,
  };
};