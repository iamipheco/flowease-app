/* ======================================================
   src/components/projects/ProjectCard.jsx
   Project Card - Asana Style
====================================================== */
import { motion } from "framer-motion";
import { MoreHorizontal, Users, CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "../../utils/cn";

const ProjectCard = ({ project, onClick, isActive }) => {
  // Calculate progress
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      active: {
        label: "On track",
        bgColor: "bg-primary",
        textColor: "text-white",
      },
      "on-hold": {
        label: "On hold",
        bgColor: "bg-warning",
        textColor: "text-white",
      },
      completed: {
        label: "Complete",
        bgColor: "bg-success",
        textColor: "text-white",
      },
    };
    return configs[status] || configs.active;
  };

  const statusConfig = getStatusConfig(project.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "card cursor-pointer group transition-all",
        isActive && "ring-2 ring-primary bg-primary/5"
      )}
    >
      {/* Project Color Bar */}
      <div
        className="h-1 w-full -mt-6 -mx-6 mb-4 rounded-t-lg"
        style={{ backgroundColor: project.color || "#3b82f6" }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-dark-text flex-1 line-clamp-2">
          {project.name}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Open menu
          }}
          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-dark-bg3 rounded transition-all"
        >
          <MoreHorizontal className="w-4 h-4 text-dark-muted" />
        </button>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-dark-muted line-clamp-2 mb-3">
          {project.description}
        </p>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-dark-bg3 text-dark-muted text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-dark-bg3 text-dark-muted text-xs rounded">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-dark-muted mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-dark-bg3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-border">
        {/* Status Badge */}
        <div
          className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            statusConfig.bgColor,
            statusConfig.textColor
          )}
        >
          {statusConfig.label}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-dark-muted">
          {/* Tasks */}
          {totalTasks > 0 && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{completedTasks}/{totalTasks}</span>
            </div>
          )}

          {/* Team Members */}
          {project.members && project.members.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{project.members.length}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;