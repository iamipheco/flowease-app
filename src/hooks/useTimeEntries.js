/* ======================================================
   src/hooks/useTimeEntries.js
   Time Entries Hook - Fully v5 Compatible
====================================================== */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from '../store/workspaceStore';
import { timeEntriesAPI } from '../api';

export const useTimeEntries = () => {
  const { activeWorkspace } = useWorkspaceStore();
  const queryClient = useQueryClient();

  // =============================
  // FETCH ALL TIME ENTRIES
  // =============================
  const {
    data: timeEntries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['time-entries', activeWorkspace?._id],
    queryFn: async () => {
      if (!activeWorkspace) return [];
      const response = await timeEntriesAPI.getAll({ workspace: activeWorkspace._id });
      return response.data.data || [];
    },
    enabled: !!activeWorkspace,
    staleTime: 1000 * 60, // 1 min cache
  });

  // =============================
  // FIND ACTIVE ENTRY (running timer)
  // =============================
  const activeEntry = timeEntries.find((entry) => entry.endTime === null);

  // =============================
  // START TIMER MUTATION
  // =============================
  const { mutateAsync: startTimer, isLoading: isStarting } = useMutation({
    mutationFn: async (payload) => {
      if (!payload.task || !payload.workspace) throw new Error('Task and workspace are required');
      const response = await timeEntriesAPI.start(payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', activeWorkspace?._id] });
    },
  });

  // =============================
  // STOP TIMER MUTATION
  // =============================
  const { mutateAsync: stopTimer, isLoading: isStopping } = useMutation({
    mutationFn: async (timerId) => {
      if (!timerId) throw new Error('Timer ID is required');
      const response = await timeEntriesAPI.stop(timerId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', activeWorkspace?._id] });
    },
  });

  // =============================
  // DELETE ENTRY MUTATION
  // =============================
  const { mutateAsync: deleteEntry } = useMutation({
    mutationFn: async (id) => {
      const response = await timeEntriesAPI.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', activeWorkspace?._id] });
    },
  });

  // =============================
  // UPDATE ENTRY MUTATION
  // =============================
  const { mutateAsync: updateEntry } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await timeEntriesAPI.update(id, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', activeWorkspace?._id] });
    },
  });

  return {
    timeEntries,
    activeEntry,
    isLoading,
    isError,
    error,
    startTimer,
    stopTimer,
    deleteEntry,
    updateEntry,
    isStarting,
    isStopping,
  };
};