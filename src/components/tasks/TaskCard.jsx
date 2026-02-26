import {
  MoreVertical,
  Calendar,
  Flag,
  CheckCircle2,
  Edit2,
  Trash2,
  Play,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "../../utils/formatters";
import { cn } from "../../utils/cn";

const TaskCard = ({ task, onEdit, onDelete, onComplete, onStartTimer }) => {
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "card card-hover group",
        task.status === "completed" && "opacity-75", // ✅ Changed from 'done' to 'completed'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Checkbox */}
        <button
          onClick={() => onComplete(task._id)}
          className={cn(
            "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
            task.status === "completed" // ✅ Changed from 'done' to 'completed'
              ? "bg-success border-success"
              : "border-dark-border hover:border-primary",
          )}
        >
          {task.status === "completed" && ( // ✅ Changed from 'done' to 'completed'
            <CheckCircle2 className="w-3 h-3 text-white" fill="currentColor" />
          )}
        </button>

        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-sm font-medium text-dark-text mb-1",
              task.status === "completed" && "line-through text-dark-muted",
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
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-dark-bg3 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4 text-dark-muted" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-dark-bg3 border border-dark-border rounded-lg shadow-xl overflow-hidden z-20"
                >
                  <button
                    onClick={() => {
                      onStartTimer(task);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-bg2 text-dark-text transition-colors text-left text-sm"
                  >
                    <Play className="w-4 h-4" />
                    Start Timer
                  </button>
                  <button
                    onClick={() => {
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-bg2 text-dark-text transition-colors text-left text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Task
                  </button>
                  <div className="border-t border-dark-border" />
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete task "${task.title}"?`)) {
                        onDelete(task._id);
                      }
                      setShowMenu(false);
                    }}
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
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dark-border">
        {/* Project */}
        {task.project && (
          <div className="flex items-center gap-1.5 text-xs text-dark-muted">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: task.project.color || "#3b82f6" }}
            />
            <span className="truncate max-w-[120px]">{task.project.name}</span>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs",
              isOverdue ? "text-error" : "text-dark-muted",
            )}
          >
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate, "MMM dd")}</span>
          </div>
        )}

        {/* Priority */}
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
