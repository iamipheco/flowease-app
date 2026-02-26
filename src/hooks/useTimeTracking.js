import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { timeEntriesAPI } from "../api";
import { useWorkspaceStore } from "../store/workspaceStore";
import { useTimeTrackerStore } from "../store/timeTrackerStore";

export const useTimeTracking = () => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceStore();
  const { stopTimer: stopLocalTimer } = useTimeTrackerStore();

  // Get all time entries for active workspace
  const {
    data: timeEntries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["timeEntries", activeWorkspace?._id],
    queryFn: async () => {
      if (!activeWorkspace?._id) return [];

      try {
        const response = await timeEntriesAPI.getAll({
          workspace: activeWorkspace._id,
        });
        console.log("Time entries fetched:", response.data);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Failed to fetch time entries:", error);
        return [];
      }
    },
    enabled: !!activeWorkspace?._id,
    initialData: [],
    staleTime: 30 * 1000, // 30 seconds
  });

  // Get running timer - UPDATE THIS QUERY
  // Get running timer - UPDATE THIS QUERY
const {
  data: runningTimer,
  isLoading: isLoadingRunningTimer,
} = useQuery({
  queryKey: ['runningTimer', activeWorkspace?._id],
  queryFn: async () => {
    if (!activeWorkspace?._id) return null;
    
    try {
      const response = await timeEntriesAPI.getRunning({
        workspace: activeWorkspace._id,
      });
      console.log('Running timer fetched:', response.data);
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch running timer:', error);
      return null;
    }
  },
  enabled: !!activeWorkspace?._id,
  refetchInterval: false, // ✅ DISABLE auto-refetch
  refetchOnWindowFocus: false, // ✅ DISABLE refetch on focus
  refetchOnMount: true, // Only fetch on mount
});

  // Get weekly summary
  const { data: weeklySummary, isLoading: isLoadingWeeklySummary } = useQuery({
    queryKey: ["weeklySummary", activeWorkspace?._id],
    queryFn: async () => {
      if (!activeWorkspace?._id) return null;

      try {
        const response = await timeEntriesAPI.getWeeklySummary({
          workspace: activeWorkspace._id,
        });
        console.log("Weekly summary fetched:", response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch weekly summary:", error);
        return null;
      }
    },
    enabled: !!activeWorkspace?._id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Start timer
  const startTimerMutation = useMutation({
    mutationFn: async (data) => {
      console.log("Starting timer with data:", data);

      const payload = {
        workspace: data.workspace,
        project: data.project,
        description: data.description || "",
        isBillable: data.isBillable !== undefined ? data.isBillable : true,
      };

      // Add task if provided
      if (data.task) {
        payload.task = data.task;
      }

      return timeEntriesAPI.start(payload);
    },
    onSuccess: (response) => {
      console.log("Timer started successfully:", response.data);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["runningTimer"] });
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });

      toast.success("Timer started");
    },
    onError: (error) => {
      console.error("Start timer error:", error);
      const message = error.response?.data?.message || "Failed to start timer";
      toast.error(message);
    },
  });

  // Stop timer
  const stopTimerMutation = useMutation({
    mutationFn: async (timerId) => {
      console.log("Stopping timer:", timerId);
      return timeEntriesAPI.stop(timerId);
    },
    onSuccess: (response) => {
      console.log("Timer stopped successfully:", response.data);

      // Stop local timer
      stopLocalTimer();

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["runningTimer"] });
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["weeklySummary"] });

      const duration = response.data.duration || 0;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;

      toast.success(`Timer stopped - ${hours}h ${minutes}m tracked`);
    },
    onError: (error) => {
      console.error("Stop timer error:", error);
      const message = error.response?.data?.message || "Failed to stop timer";
      toast.error(message);
    },
  });

  // Create manual time entry
  const createEntryMutation = useMutation({
    mutationFn: async (data) => {
      console.log("Creating manual entry:", data);

      const payload = {
        workspace: data.workspace,
        project: data.project,
        clockIn: data.clockIn,
        clockOut: data.clockOut,
        description: data.description || "",
        isBillable: data.isBillable !== undefined ? data.isBillable : true,
      };

      // Add task if provided
      if (data.task) {
        payload.task = data.task;
      }

      return timeEntriesAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["weeklySummary"] });

      toast.success("Time entry created");
    },
    onError: (error) => {
      console.error("Create entry error:", error);
      const message =
        error.response?.data?.message || "Failed to create time entry";
      toast.error(message);
    },
  });

  // Update time entry
  const updateEntryMutation = useMutation({
    mutationFn: ({ id, data }) => {
      console.log("Updating entry:", id, data);
      return timeEntriesAPI.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["weeklySummary"] });

      toast.success("Time entry updated");
    },
    onError: (error) => {
      console.error("Update entry error:", error);
      const message =
        error.response?.data?.message || "Failed to update time entry";
      toast.error(message);
    },
  });

  // Delete time entry
  const deleteEntryMutation = useMutation({
    mutationFn: (id) => {
      console.log("Deleting entry:", id);
      return timeEntriesAPI.delete(id);
    },
    onMutate: async (entryId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["timeEntries"] });

      // Snapshot previous value
      const previousEntries = queryClient.getQueryData([
        "timeEntries",
        activeWorkspace?._id,
      ]);

      // Optimistically remove entry
      queryClient.setQueryData(["timeEntries", activeWorkspace?._id], (old) => {
        const oldEntries = Array.isArray(old) ? old : [];
        return oldEntries.filter((entry) => entry._id !== entryId);
      });

      return { previousEntries };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["weeklySummary"] });

      toast.success("Time entry deleted");
    },
    onError: (error, entryId, context) => {
      console.error("Delete entry error:", error);

      // Rollback
      if (context?.previousEntries) {
        queryClient.setQueryData(
          ["timeEntries", activeWorkspace?._id],
          context.previousEntries,
        );
      }

      const message =
        error.response?.data?.message || "Failed to delete time entry";
      toast.error(message);
    },
  });

  return {
    // Data
    timeEntries: Array.isArray(timeEntries) ? timeEntries : [],
    runningTimer,
    weeklySummary,
    isLoading,
    isLoadingRunningTimer,
    isLoadingWeeklySummary,
    error,

    // Mutations
    startTimer: startTimerMutation.mutate,
    stopTimer: stopTimerMutation.mutate,
    createEntry: createEntryMutation.mutate,
    updateEntry: updateEntryMutation.mutate,
    deleteEntry: deleteEntryMutation.mutate,

    // Loading states
    isStarting: startTimerMutation.isPending,
    isStopping: stopTimerMutation.isPending,
    isCreating: createEntryMutation.isPending,
    isUpdating: updateEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
  };
};
