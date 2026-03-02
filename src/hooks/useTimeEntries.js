/* ======================================================
   src/hooks/useTimeEntries.js
   Time Entries Hook - Fully v5 Compatible + Stats
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
      const response = await timeEntriesAPI.getAll({
        workspace: activeWorkspace._id,
      });
      return response.data.data || [];
    },
    enabled: !!activeWorkspace,
    staleTime: 1000 * 60,
  });

  // =============================
  // ACTIVE ENTRY
  // =============================
  const activeEntry = timeEntries.find(
    (entry) => entry.endTime === null
  );

  // =============================
  // DATE HELPERS
  // =============================
  const now = new Date();

  const isToday = (date) => {
    const d = new Date(date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const isThisWeek = (date) => {
    return new Date(date) >= startOfWeek;
  };

  // =============================
  // TODAY ENTRIES
  // =============================
  const todayEntries = timeEntries.filter((entry) =>
    isToday(entry.startTime)
  );

  // =============================
  // WEEK ENTRIES
  // =============================
  const weekEntries = timeEntries.filter((entry) =>
    isThisWeek(entry.startTime)
  );

  // =============================
  // TIME CALCULATION HELPER
  // =============================
  const calculateDuration = (entry) => {
    const start = new Date(entry.startTime);
    const end = entry.endTime ? new Date(entry.endTime) : new Date();
    return (end - start) / (1000 * 60); // minutes
  };

  // =============================
  // TODAY TOTAL
  // =============================
  const todayTotalMinutes = todayEntries.reduce(
    (total, entry) => total + calculateDuration(entry),
    0
  );

  const todayHours = Math.floor(todayTotalMinutes / 60);
  const todayMinutes = Math.floor(todayTotalMinutes % 60);

  // =============================
  // WEEK TOTAL
  // =============================
  const weekTotalMinutes = weekEntries.reduce(
    (total, entry) => total + calculateDuration(entry),
    0
  );

  const weekHours = Math.floor(weekTotalMinutes / 60);
  const weekMinutes = Math.floor(weekTotalMinutes % 60);

  // =============================
  // MUTATIONS
  // =============================
  const { mutateAsync: startTimer, isLoading: isStarting } = useMutation({
    mutationFn: async (payload) => {
      if (!payload.task || !payload.workspace)
        throw new Error('Task and workspace are required');
      const response = await timeEntriesAPI.start(payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['time-entries', activeWorkspace?._id],
      });
    },
  });

  const { mutateAsync: stopTimer, isLoading: isStopping } = useMutation({
    mutationFn: async (timerId) => {
      if (!timerId) throw new Error('Timer ID is required');
      const response = await timeEntriesAPI.stop(timerId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['time-entries', activeWorkspace?._id],
      });
    },
  });

  const { mutateAsync: deleteEntry } = useMutation({
    mutationFn: async (id) => {
      const response = await timeEntriesAPI.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['time-entries', activeWorkspace?._id],
      });
    },
  });

  const { mutateAsync: updateEntry } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await timeEntriesAPI.update(id, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['time-entries', activeWorkspace?._id],
      });
    },
  });

  return {
    // raw data
    timeEntries,
    activeEntry,

    // computed stats
    todayEntries,
    todayHours,
    todayMinutes,
    weekHours,
    weekMinutes,

    // state
    isLoading,
    isError,
    error,

    // mutations
    startTimer,
    stopTimer,
    deleteEntry,
    updateEntry,
    isStarting,
    isStopping,
  };
};