import { useState, useEffect } from "react";
import { X, CheckSquare, Calendar, Flag, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "../../hooks/useProjects";

const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData = null,
}) => {
  const { projects, isLoading: projectsLoading } = useProjects(); // ✅ Add this
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    project: initialData?.project?._id || initialData?.project || "",
    priority: initialData?.priority || "medium",
    status: initialData?.status || "todo",
    dueDate: initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : "",
    assignedTo: initialData?.assignedTo?.map((u) => u._id || u) || [],
  });

  // Debug: Log projects
  useEffect(() => {
    console.log("Projects in modal:", projects);
    console.log("Projects loading:", projectsLoading);
  }, [projects, projectsLoading]);

  const priorities = [
    { value: "low", label: "Low", color: "text-info" },
    { value: "medium", label: "Medium", color: "text-warning" },
    { value: "high", label: "High", color: "text-error" },
    { value: "urgent", label: "Urgent", color: "text-error" },
  ];

  const statuses = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "In Review" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.project) {
      return;
    }

    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      project: formData.project,
      priority: formData.priority,
      status: formData.status,
    };

    if (formData.dueDate) {
      submitData.dueDate = formData.dueDate;
    }

    if (formData.assignedTo.length > 0) {
      submitData.assignedTo = formData.assignedTo;
    }

    onSubmit(submitData);

    if (!isEditing) {
      setFormData({
        title: "",
        description: "",
        project: "",
        priority: "medium",
        status: "todo",
        dueDate: "",
        assignedTo: [],
      });
    }
  };

  const handleClose = () => {
    if (!isEditing) {
      setFormData({
        title: "",
        description: "",
        project: "",
        priority: "medium",
        status: "todo",
        dueDate: "",
        assignedTo: [],
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-dark-bg2 border border-dark-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-border sticky top-0 bg-dark-bg2 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-dark-text">
                    {isEditing ? "Edit Task" : "Create New Task"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-muted" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Task Title <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Design landing page, Fix authentication bug"
                    className="input"
                    required
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Add more details about this task..."
                    className="input min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>

                {/* Project Selection */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Project <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) =>
                      setFormData({ ...formData, project: e.target.value })
                    }
                    className="input"
                    required
                    disabled={projectsLoading}
                  >
                    <option value="">
                      {projectsLoading
                        ? "Loading projects..."
                        : "Select project..."}
                    </option>
                    {Array.isArray(projects) &&
                      projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                  </select>

                  {/* Debug info - Remove after testing */}
                  {!projectsLoading && (!projects || projects.length === 0) && (
                    <p className="text-xs text-error mt-1">
                      No projects found. Please create a project first.
                    </p>
                  )}
                </div>

                {/* Priority & Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      <Flag className="w-4 h-4 inline mr-2" />
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="input"
                    >
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="input"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="input"
                  />
                </div>

                {/* Priority Preview */}
                <div className="p-4 bg-dark-bg3 rounded-lg border border-dark-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-muted">
                      Priority Preview:
                    </span>
                    <span className={`priority-${formData.priority} text-xs`}>
                      {formData.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-dark-muted">
                      Status Preview:
                    </span>
                    <span className={`status-${formData.status} text-xs`}>
                      {statuses.find((s) => s.value === formData.status)?.label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-secondary flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={
                      isLoading ||
                      !formData.title.trim() ||
                      !formData.project ||
                      projectsLoading
                    }
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        {isEditing ? "Updating..." : "Creating..."}
                      </div>
                    ) : (
                      <>{isEditing ? "Update Task" : "Create Task"}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;
