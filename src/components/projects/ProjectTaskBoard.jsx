/* ======================================================
   src/components/projects/ProjectTasksBoard.jsx
   Tasks Board - Shows all tasks in this project
====================================================== */
import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "../tasks/TaskCard";
import TaskDetailSidebar from "../tasks/TaskDetailSidebar";
import CreateTaskModal from "../tasks/CreateTaskModal";
import { useTasks } from "../../hooks/useTasks";

const ProjectTasksBoard = ({ project }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { tasks, createTask, updateTask, deleteTask, completeTask } = useTasks();

  // Filter tasks for this project
  const projectTasks = tasks.filter(task => task.project?._id === project._id);

  // Filter by search
  const filteredTasks = projectTasks.filter(task =>
    task?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by status
  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
  };

  const columns = [
    { key: 'todo', label: 'To Do', color: 'border-blue-500' },
    { key: 'in-progress', label: 'In Progress', color: 'border-warning' },
    { key: 'review', label: 'In Review', color: 'border-primary' },
    { key: 'completed', label: 'Done', color: 'border-success' },
  ];

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  const handleCreateTask = (data) => {
    createTask(
      { ...data, project: project._id },
      {
        onSuccess: () => setShowCreateModal(false),
      }
    );
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks in this project..."
                className="input input-with-icon-left w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="btn btn-secondary btn-sm">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-4 h-4" />
                Add task
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {columns.map((column) => (
              <div key={column.key} className="bg-dark-bg2 border border-dark-border rounded-lg p-3">
                <div className="text-xs text-dark-muted mb-1">{column.label}</div>
                <div className="text-2xl font-bold text-dark-text">
                  {tasksByStatus[column.key].length}
                </div>
              </div>
            ))}
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <div key={column.key} className="flex flex-col">
                {/* Column Header */}
                <div className={`border-l-4 ${column.color} pl-3 py-2 mb-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-dark-text">
                      {column.label}
                    </h3>
                    <span className="text-xs text-dark-muted">
                      {tasksByStatus[column.key].length}
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3 flex-1">
                  <AnimatePresence>
                    {tasksByStatus[column.key].map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                        onComplete={completeTask}
                        onDelete={deleteTask}
                        isActive={selectedTask?._id === task._id}
                      />
                    ))}
                  </AnimatePresence>

                  {tasksByStatus[column.key].length === 0 && (
                    <div className="card text-center py-8 bg-dark-bg2/50">
                      <p className="text-xs text-dark-muted">No tasks</p>
                    </div>
                  )}

                  {/* Add Task Button */}
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-dark-muted hover:bg-dark-bg2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Detail Sidebar */}
      <TaskDetailSidebar
        task={selectedTask}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        onUpdate={(data) => updateTask({ id: selectedTask._id, data })}
        onDelete={() => {
          deleteTask(selectedTask._id);
          handleCloseSidebar();
        }}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        initialData={{ project: project._id }}
      />
    </div>
  );
};

export default ProjectTasksBoard;