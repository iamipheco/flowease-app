import {
  MoreVertical,
  Calendar,
  Flag,
  CheckCircle2,
  Edit2,
  Trash2,
  Play,
  Circle,
  Clock,
  Eye,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "../../utils/formatters";
import { cn } from "../../utils/cn";

const TaskCard = ({ 
  task, 
  onClick,        // ✨ NEW: Click to open sidebar
  isActive,       // ✨ NEW: Highlight when selected
  onEdit, 
  onDelete, 
  onComplete, 
  onStartTimer 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      todo: {
        label: "To Do",
        icon: Circle,
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-500",
        borderColor: "border-blue-500/30",
      },
      "in-progress": {
        label: "In Progress",
        icon: Clock,
        bgColor: "bg-warning/10",
        textColor: "text-warning",
        borderColor: "border-warning/30",
      },
      review: {
        label: "In Review",
        icon: Eye,
        bgColor: "bg-primary/10",
        textColor: "text-primary",
        borderColor: "border-primary/30",
      },
      completed: {
        label: "Completed",
        icon: CheckCircle2,
        bgColor: "bg-success/10",
        textColor: "text-success",
        borderColor: "border-success/30",
      },
      cancelled: {
        label: "Cancelled",
        icon: Circle,
        bgColor: "bg-error/10",
        textColor: "text-error",
        borderColor: "border-error/30",
      },
    };
    return configs[status] || configs.todo;
  };

  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;

  // ✨ NEW: Prevent sidebar from opening when clicking action buttons
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}  // ✨ NEW: Click to open sidebar
      className={cn(
        "card card-hover group cursor-pointer",  // ✨ NEW: cursor-pointer
        task.status === "completed" && "opacity-75",
        isActive && "ring-2 ring-primary bg-primary/5"  // ✨ NEW: Active state
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Checkbox */}
        <button
          onClick={(e) => handleActionClick(e, () => onComplete(task._id))}  // ✨ UPDATED: Stop propagation
          className={cn(
            "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
            task.status === "completed"
              ? "bg-success border-success"
              : "border-dark-border hover:border-primary"
          )}
        >
          {task.status === "completed" && (
            <CheckCircle2 className="w-3 h-3 text-white" fill="currentColor" />
          )}
        </button>

        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-sm font-medium text-dark-text mb-1",
              task.status === "completed" && "line-through text-dark-muted"
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-dark-muted line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => handleActionClick(e, () => setShowMenu(!showMenu))}  // ✨ UPDATED: Stop propagation
            className="p-1 hover:bg-dark-bg3 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4 text-dark-muted" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();  // ✨ NEW: Stop propagation
                    setShowMenu(false);
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={(e) => e.stopPropagation()}  // ✨ NEW: Stop propagation
                  className="absolute right-0 mt-2 w-48 bg-dark-bg3 border border-dark-border rounded-lg shadow-xl overflow-hidden z-20"
                >
                  <button
                    onClick={(e) => handleActionClick(e, () => {
                      onStartTimer(task);
                      setShowMenu(false);
                    })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-bg2 text-dark-text transition-colors text-left text-sm"
                  >
                    <Play className="w-4 h-4" />
                    Start Timer
                  </button>
                  <button
                    onClick={(e) => handleActionClick(e, () => {
                      onEdit(task);
                      setShowMenu(false);
                    })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-bg2 text-dark-text transition-colors text-left text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Task
                  </button>
                  <div className="border-t border-dark-border" />
                  <button
                    onClick={(e) => handleActionClick(e, () => {
                      if (window.confirm(`Delete task "${task.title}"?`)) {
                        onDelete(task._id);
                      }
                      setShowMenu(false);
                    })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-error/10 text-error transition-colors text-left text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dark-border flex-wrap">
        {/* Status Badge */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium",
            statusConfig.bgColor,
            statusConfig.textColor,
            statusConfig.borderColor
          )}
        >
          <StatusIcon className="w-3 h-3" />
          <span>{statusConfig.label}</span>
        </div>

        {task.project && (
          <div className="flex items-center gap-1.5 text-xs text-dark-muted">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: task.project.color || "#3b82f6" }}
            />
            <span className="truncate max-w-[120px]">{task.project.name}</span>
          </div>
        )}

        {task.dueDate && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs",
              isOverdue ? "text-error" : "text-dark-muted"
            )}
          >
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate, "MMM dd")}</span>
          </div>
        )}

        <div className="ml-auto">
          <span className={`priority-${task.priority} text-xs`}>
            {task.priority}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;