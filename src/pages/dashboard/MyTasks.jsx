import { useState } from "react";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../../hooks/useTasks";
import { useWorkspaceStore } from "../../store/workspaceStore";
import TaskCard from "../../components/tasks/TaskCard";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import { useNavigate } from "react-router-dom";

const MyTasks = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  const { activeWorkspace } = useWorkspaceStore();
  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    isCreating,
    isUpdating,
  } = useTasks();

  const handleCreateTask = (data) => {
    createTask(
      {
        ...data,
        workspace: activeWorkspace._id,
      },
      {
        onSuccess: () => {
          setShowCreateModal(false);
        },
      },
    );
  };

  const handleUpdateTask = (data) => {
    if (!editingTask) return;

    updateTask(
      {
        id: editingTask._id,
        data,
      },
      {
        onSuccess: () => {
          setEditingTask(null);
        },
      },
    );
  };

  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
  };

  const handleStartTimer = (task) => {
    // Navigate to time tracking with task pre-selected
    navigate("/dashboard/time", { state: { task } });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  // Filter tasks
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        // Search filter
        const matchesSearch =
          task?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task?.description?.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus =
          filterStatus === "all" || task?.status === filterStatus;

        // Priority filter
        const matchesPriority =
          filterPriority === "all" || task?.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
      })
    : [];

  // Group tasks by status for board view
  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    review: filteredTasks.filter((t) => t.status === "review"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
  };

  const statusColumns = [
    { key: "todo", label: "To Do", color: "border-info" },
    { key: "in-progress", label: "In Progress", color: "border-warning" },
    { key: "review", label: "In Review", color: "border-primary" },
    { key: "completed", label: "Completed", color: "border-success" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-text mb-2">
            My Tasks
          </h1>
          <p className="text-dark-muted">
            {activeWorkspace?.name} • {tasks.length} task
            {tasks.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="input pl-10 w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="completed">Completed</option> 
            <option value="cancelled">Cancelled</option> 
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-dark-bg2 border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`p-2 rounded transition-colors ${
                viewMode === "board"
                  ? "bg-primary text-white"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-dark-muted">Loading tasks...</p>
          </div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-dark-bg3 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-dark-muted" />
          </div>
          <h3 className="text-xl font-display font-bold text-dark-text mb-2">
            {searchQuery || filterStatus !== "all" || filterPriority !== "all"
              ? "No tasks found"
              : "No tasks yet"}
          </h3>
          <p className="text-sm text-dark-muted mb-6">
            {searchQuery || filterStatus !== "all" || filterPriority !== "all"
              ? "Try adjusting your filters"
              : "Create your first task to get started"}
          </p>
          {!searchQuery &&
            filterStatus === "all" &&
            filterPriority === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" />
                Create First Task
              </button>
            )}
        </div>
      ) : viewMode === "list" ? (
        /* List View */
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={deleteTask}
                onComplete={handleCompleteTask}
                onStartTimer={handleStartTimer}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Board/Kanban View */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {statusColumns.map((column) => (
            <div key={column.key} className="space-y-3">
              {/* Column Header */}
              <div className={`border-l-4 ${column.color} pl-3`}>
                <h3 className="text-sm font-semibold text-dark-text">
                  {column.label}
                </h3>
                <p className="text-xs text-dark-muted mt-1">
                  {tasksByStatus[column.key].length} task
                  {tasksByStatus[column.key].length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                <AnimatePresence>
                  {tasksByStatus[column.key].map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                      onComplete={handleCompleteTask}
                      onStartTimer={handleStartTimer}
                    />
                  ))}
                </AnimatePresence>

                {tasksByStatus[column.key].length === 0 && (
                  <div className="card text-center py-8">
                    <p className="text-xs text-dark-muted">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        isLoading={isCreating}
      />

      {/* Edit Task Modal */}
      <CreateTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        isLoading={isUpdating}
        initialData={editingTask}
      />
    </div>
  );
};

export default MyTasks;
