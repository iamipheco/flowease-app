import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksAPI } from "../api";
import { useWorkspaceStore } from "../store/workspaceStore";

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceStore();

  // ===============================
  // GET ALL TASKS
  // ===============================
  const {
    data: tasks,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["tasks", activeWorkspace?._id],
    queryFn: async () => {
      if (!activeWorkspace?._id) return [];
      const response = await tasksAPI.getAll({
        workspace: activeWorkspace._id,
      });
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!activeWorkspace?._id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // ===============================
  // GET SINGLE TASK
  // ===============================
  const useTask = (id) =>
    useQuery({
      queryKey: ["task", id],
      queryFn: async () => {
        const response = await tasksAPI.getById(id);
        return response.data;
      },
      enabled: !!id,
      retry: 1,
    });

  // ===============================
  // CREATE TASK
  // ===============================
  const createTaskMutation = useMutation({
    mutationFn: tasksAPI.create,
    onSuccess: (response) => {
      queryClient.setQueryData(["tasks", activeWorkspace?._id], (old = []) => [
        ...old,
        response.data,
      ]);
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });

  // ===============================
  // UPDATE TASK
  // ===============================
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => tasksAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(["tasks", activeWorkspace?._id]);
      const previousTasks = queryClient.getQueryData([
        "tasks",
        activeWorkspace?._id,
      ]);
      queryClient.setQueryData(["tasks", activeWorkspace?._id], (old = []) =>
        old.map((task) => (task._id === id ? { ...task, ...data } : task)),
      );
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasks", activeWorkspace?._id],
          context.previousTasks,
        );
      }
      toast.error("Failed to update task");
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["task", response.data._id] });
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      toast.success("Task updated successfully");
    },
  });

  // ===============================
  // DELETE TASK
  // ===============================
  const deleteTaskMutation = useMutation({
    mutationFn: tasksAPI.delete,
    onSuccess: (_, taskId) => {
      queryClient.setQueryData(["tasks", activeWorkspace?._id], (old = []) =>
        old.filter((task) => task._id !== taskId),
      );
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  // ===============================
  // COMPLETE / REOPEN TASK (TOGGLE)
  // ===============================
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const currentTasks =
        queryClient.getQueryData(["tasks", activeWorkspace?._id]) ?? [];
      const currentTask = currentTasks.find((t) => t._id === taskId);
      if (!currentTask) throw new Error("Task not found");

      const newStatus =
        currentTask.status === "completed" ? "todo" : "completed";
      return tasksAPI.update(taskId, { status: newStatus });
    },

    // Optimistic UI update
    onMutate: async (taskId) => {
      await queryClient.cancelQueries(["tasks", activeWorkspace?._id]);
      const previousTasks = queryClient.getQueryData([
        "tasks",
        activeWorkspace?._id,
      ]);

      let newStatus = "completed"; // default
      queryClient.setQueryData(["tasks", activeWorkspace?._id], (old = []) =>
        old.map((task) => {
          if (task._id === taskId) {
            const updatedStatus =
              task.status === "completed" ? "todo" : "completed";
            newStatus = updatedStatus; // save for toast
            return { ...task, status: updatedStatus };
          }
          return task;
        }),
      );

      return { previousTasks, newStatus };
    },

    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasks", activeWorkspace?._id],
          context.previousTasks,
        );
      }
      toast.error("Failed to update task");
    },

    onSuccess: (_response, _taskId, context) => {
      toast.success(
        context.newStatus === "completed"
          ? "Task Completed! 🎉"
          : "Task Re-opened",
      );
    },
  });

  // ===============================
  // ASSIGN USERS
  // ===============================
  const assignUsersMutation = useMutation({
    mutationFn: ({ taskId, userIds }) =>
      tasksAPI.assignUsers(taskId, { userIds }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["task", response.data._id] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", activeWorkspace?._id],
      });
      toast.success("Users assigned to task");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to assign users");
    },
  });

  // ===============================
  // ADD COMMENT
  // ===============================
  const addCommentMutation = useMutation({
    mutationFn: ({ taskId, text }) => tasksAPI.addComment(taskId, { text }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["task", response.data._id] });
      toast.success("Comment added");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add comment");
    },
  });

  return {
    tasks: Array.isArray(tasks) ? tasks : [],
    isLoading,
    isFetching,
    error,
    refetch,
    useTask,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    completeTask: completeTaskMutation.mutate,
    assignUsers: assignUsersMutation.mutate,
    addComment: addCommentMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};
