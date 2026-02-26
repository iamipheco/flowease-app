import { MoreVertical, Calendar, Users, CheckCircle2, Clock, Trash2, Edit2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate project stats
  const totalTasks = project.taskCount || 0;
  const completedTasks = project.completedTaskCount || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="card card-hover cursor-pointer group"
      onClick={() => navigate(`/dashboard/projects/${project._id}`)}
    >
      {/* Color bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ backgroundColor: project.color || '#3b82f6' }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 mt-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <div
              className="w-5 h-5 rounded"
              style={{ backgroundColor: project.color }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-display font-bold text-dark-text truncate group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-dark-muted line-clamp-1">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4 text-dark-muted" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />

                {/* Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-dark-bg3 border border-dark-border rounded-lg shadow-xl overflow-hidden z-20"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(project);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-bg2 text-dark-text transition-colors text-left text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Project
                  </button>
                  <div className="border-t border-dark-border" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
                        onDelete(project._id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-error/10 text-error transition-colors text-left text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Project
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-dark-muted">
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-info" />
          <span className="text-dark-muted">
            {project.members?.length || 0}
          </span>
        </div>
        {project.endDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-warning" />
            <span className="text-dark-muted text-xs">
              {formatDate(project.endDate, 'MMM dd')}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-dark-muted">Progress</span>
            <span className="font-semibold text-dark-text">{progress}%</span>
          </div>
          <div className="w-full bg-dark-bg3 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: project.color }}
            />
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="mt-4">
        <span className={`status-${project.status || 'active'} text-xs`}>
          {project.status || 'active'}
        </span>
      </div>
    </motion.div>
  );
};

export default ProjectCard;