/* ======================================================
   src/components/projects/ProjectDetailSidebar.jsx
   Project Detail Sidebar - Asana Style
====================================================== */
import { useState, useEffect } from 'react';
import { 
  X, MoreVertical, Plus, Calendar, Users, Flag, 
  CheckCircle2, Trash2, Copy, Share2, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const ProjectDetailSidebar = ({ project, isOpen, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
  });
  const [localProject, setLocalProject] = useState(project);
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (project) {
      setLocalProject(project);
    }
  }, [project]);

  if (!project) return null;

  const handleUpdate = (field, value) => {
    const updated = { ...localProject, [field]: value };
    setLocalProject(updated);
    onUpdate?.(updated);
  };

  // Calculate stats
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Mobile Only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={onClose}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                "fixed top-0 right-0 bottom-0 left-0 z-50 lg:left-auto",
                "lg:relative lg:w-[600px] lg:z-0",
                "bg-dark-bg1 border-l border-dark-border",
                "flex flex-col overflow-hidden shadow-2xl"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border bg-dark-bg2 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-dark-text" />
                  </button>
                  
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: project.color || '#3b82f6' }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors">
                    <Settings className="w-4 h-4 text-dark-muted" />
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowOptions(!showOptions)}
                      className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-dark-muted" />
                    </button>

                    <AnimatePresence>
                      {showOptions && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowOptions(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-dark-bg3 border border-dark-border rounded-lg shadow-xl overflow-hidden z-20"
                          >
                            <button className="w-full px-4 py-2 text-left text-sm text-dark-text hover:bg-dark-bg2 flex items-center gap-2">
                              <Copy className="w-4 h-4" />
                              Duplicate project
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-dark-text hover:bg-dark-bg2 flex items-center gap-2">
                              <Share2 className="w-4 h-4" />
                              Share project
                            </button>
                            <div className="border-t border-dark-border" />
                            <button
                              onClick={() => {
                                onDelete?.(project._id);
                                setShowOptions(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-white bg-error hover:bg-error/90 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete project
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 px-6 py-2 border-b border-dark-border bg-dark-bg2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeTab === 'overview'
                      ? "bg-dark-bg1 text-dark-text"
                      : "text-dark-muted hover:text-dark-text"
                  )}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeTab === 'tasks'
                      ? "bg-dark-bg1 text-dark-text"
                      : "text-dark-muted hover:text-dark-text"
                  )}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeTab === 'files'
                      ? "bg-dark-bg1 text-dark-text"
                      : "text-dark-muted hover:text-dark-text"
                  )}
                >
                  Files
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-dark-bg1">
                <div className="p-6 space-y-6">
                  {/* Project Name */}
                  <div>
                    {isEditing.name ? (
                      <input
                        autoFocus
                        value={localProject?.name || ''}
                        onChange={(e) => setLocalProject({ ...localProject, name: e.target.value })}
                        onBlur={() => {
                          setIsEditing({ ...isEditing, name: false });
                          handleUpdate('name', localProject?.name);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditing({ ...isEditing, name: false });
                            handleUpdate('name', localProject?.name);
                          }
                        }}
                        className="w-full text-2xl font-bold bg-transparent border-none outline-none text-dark-text"
                      />
                    ) : (
                      <h1
                        onClick={() => setIsEditing({ ...isEditing, name: true })}
                        className="text-2xl font-bold text-dark-text cursor-text hover:bg-dark-bg2 rounded px-2 -mx-2 py-1"
                      >
                        {localProject?.name || 'Untitled Project'}
                      </h1>
                    )}
                  </div>

                  {/* Progress Section */}
                  <div className="bg-dark-bg2 border border-dark-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-dark-text">Progress</span>
                      <span className="text-sm text-dark-muted">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-dark-bg3 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span className="text-dark-muted">{completedTasks} completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-dark-border" />
                        <span className="text-dark-muted">{totalTasks - completedTasks} remaining</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-3">
                    {/* Owner */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Owner
                      </label>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 px-3 py-2 bg-dark-bg2 border border-dark-border rounded-lg">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white font-medium">
                            {project.owner?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm text-dark-text">
                            {project.owner?.name || 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Due date
                      </label>
                      <div className="flex-1">
                        <button className="flex items-center gap-2 px-3 py-2 w-full hover:bg-dark-bg3 rounded-lg transition-colors bg-dark-bg2 border border-dark-border text-left">
                          <Calendar className="w-4 h-4 text-dark-muted" />
                          <span className="text-sm text-dark-muted">
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Status
                      </label>
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white border border-primary rounded-lg text-sm font-medium">
                          {project.status === 'active' ? 'On track' : project.status}
                        </div>
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Priority
                      </label>
                      <div className="flex-1">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
                          project.priority === 'high' ? 'bg-error text-white border border-error' :
                          project.priority === 'medium' ? 'bg-warning text-white border border-warning' :
                          'bg-dark-bg2 text-dark-text border border-dark-border'
                        )}>
                          <Flag className="w-3.5 h-3.5" />
                          {project.priority || 'Medium'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-dark-text mb-2">Description</h3>
                    {isEditing.description ? (
                      <textarea
                        autoFocus
                        value={localProject?.description || ''}
                        onChange={(e) => setLocalProject({ ...localProject, description: e.target.value })}
                        onBlur={() => {
                          setIsEditing({ ...isEditing, description: false });
                          handleUpdate('description', localProject?.description);
                        }}
                        className="w-full min-h-[100px] p-3 bg-dark-bg2 border border-dark-border rounded-lg text-sm text-dark-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="What is this project about?"
                      />
                    ) : (
                      <div
                        onClick={() => setIsEditing({ ...isEditing, description: true })}
                        className="p-3 min-h-[60px] hover:bg-dark-bg2 rounded-lg cursor-text text-sm text-dark-muted italic bg-dark-bg2 border border-dark-border"
                      >
                        {localProject?.description || 'What is this project about?'}
                      </div>
                    )}
                  </div>

                  {/* Team Members */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-dark-text">Team Members</h3>
                      <button className="text-sm text-primary hover:underline">
                        Add member
                      </button>
                    </div>
                    <div className="space-y-2">
                      {project.members?.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 hover:bg-dark-bg2 rounded-lg">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs text-white font-medium">
                            {member.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-dark-text">{member.name}</div>
                            <div className="text-xs text-dark-muted">{member.role || 'Member'}</div>
                          </div>
                        </div>
                      ))}
                      {(!project.members || project.members.length === 0) && (
                        <p className="text-sm text-dark-muted italic">No team members yet</p>
                      )}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-dark-text">Milestones</h3>
                      <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <p className="text-sm text-dark-muted italic">No milestones yet</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetailSidebar;