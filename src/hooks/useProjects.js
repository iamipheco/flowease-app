import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { projectsAPI } from '../api';
import { useWorkspaceStore } from '../store/workspaceStore';

export const useProjects = () => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceStore();


  // Get all projects for active workspace
  const { data: projects, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ['projects', activeWorkspace?._id],
    queryFn: async () => {  
      if (!activeWorkspace?._id) {
        return [];
      }
      
      try {
       
        const response = await projectsAPI.getAll({ workspace: activeWorkspace._id });
        
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ API Error:', error);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return [];
      }
    },
    enabled: !!activeWorkspace?._id, // Only run when workspace exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Force refetch when workspace changes
  useEffect(() => {
    if (activeWorkspace?._id) {
      refetch();
    }
  }, [activeWorkspace?._id, refetch]);


  // Create project
  const createProjectMutation = useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: (response) => {
      
      // Update cache immediately
      queryClient.setQueryData(['projects', activeWorkspace?._id], (old) => {
        const oldProjects = Array.isArray(old) ? old : [];
        return [...oldProjects, response.data];
      });
      
      toast.success(`Project "${response.data.name}" created successfully`);
    },
    onError: (error) => {
      console.error('❌ Create project error:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });

  // Update project
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => projectsAPI.update(id, data),
    onSuccess: (response) => {
      
      // Update cache
      queryClient.setQueryData(['projects', activeWorkspace?._id], (old) => {
        const oldProjects = Array.isArray(old) ? old : [];
        return oldProjects.map((project) =>
          project._id === response.data._id ? response.data : project
        );
      });
      
      toast.success('Project updated successfully');
    },
    onError: (error) => {
      console.error('❌ Update project error:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });

  // Delete project
  const deleteProjectMutation = useMutation({
    mutationFn: projectsAPI.delete,
    onSuccess: (response, projectId) => {
      
      // Remove from cache
      queryClient.setQueryData(['projects', activeWorkspace?._id], (old) => {
        const oldProjects = Array.isArray(old) ? old : [];
        return oldProjects.filter((p) => p._id !== projectId);
      });
      
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      console.error('❌ Delete project error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });

  return {
    projects: Array.isArray(projects) ? projects : [],
    isLoading,
    isFetching,
    error,
    refetch,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
};