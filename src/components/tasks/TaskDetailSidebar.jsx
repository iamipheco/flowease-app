/* ======================================================
   src/components/tasks/TaskDetailSidebar.jsx
   CORRECT Implementation: Desktop Right Panel + Mobile Fullscreen
====================================================== */
import { useState, useEffect } from 'react';
import { 
  X, MoreVertical, Maximize2, Calendar, Plus, 
  ChevronDown, Trash2, Copy, Share2, Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const TaskDetailSidebar = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState({
    title: false,
    description: false,
  });
  const [localTask, setLocalTask] = useState(task);
  const [newComment, setNewComment] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (task) {
      setLocalTask(task);
    }
  }, [task]);

  if (!task) return null;

  const handleUpdate = (field, value) => {
    const updated = { ...localTask, [field]: value };
    setLocalTask(updated);
    onUpdate?.(updated);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    console.log('Adding comment:', newComment);
    setNewComment('');
  };

  return (
    <>
      {/* Mobile: Fullscreen Overlay with Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Mobile Only - SOLID */}
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
                // Mobile: Fixed fullscreen overlay
                "fixed top-0 right-0 bottom-0 left-0 z-50 lg:left-auto",
                // Desktop: Static right panel (NOT overlay)
                "lg:relative lg:w-[500px] lg:z-0",
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
                  
                  <button className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded-md hover:bg-success/90 transition-colors border border-success">
                    ✓ Mark complete
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors hidden md:block">
                    <Maximize2 className="w-4 h-4 text-dark-muted" />
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
                              Duplicate task
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-dark-text hover:bg-dark-bg2 flex items-center gap-2">
                              <Share2 className="w-4 h-4" />
                              Share task
                            </button>
                            <div className="border-t border-dark-border" />
                            <button
                              onClick={() => {
                                onDelete?.(task._id);
                                setShowOptions(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-white bg-error hover:bg-error/90 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete task
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto bg-dark-bg1">
                <div className="p-6 space-y-5">
                  {/* Privacy Notice */}
                  <div className="flex items-center justify-between px-3 py-2 bg-dark-bg2 rounded-lg border border-dark-border">
                    <div className="flex items-center gap-2 text-xs text-dark-muted">
                      <div className="w-1.5 h-1.5 bg-dark-muted rounded-full flex-shrink-0" />
                      <span>This task is visible to everyone in workspace.</span>
                    </div>
                  </div>

                  {/* Task Title */}
                  <div>
                    {isEditing.title ? (
                      <input
                        autoFocus
                        value={localTask?.title || ''}
                        onChange={(e) => setLocalTask({ ...localTask, title: e.target.value })}
                        onBlur={() => {
                          setIsEditing({ ...isEditing, title: false });
                          handleUpdate('title', localTask?.title);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditing({ ...isEditing, title: false });
                            handleUpdate('title', localTask?.title);
                          }
                        }}
                        className="w-full text-xl font-bold bg-transparent border-none outline-none text-dark-text"
                      />
                    ) : (
                      <h1
                        onClick={() => setIsEditing({ ...isEditing, title: true })}
                        className="text-xl font-bold text-dark-text cursor-text hover:bg-dark-bg2 rounded px-2 -mx-2 py-1"
                      >
                        {localTask?.title || 'Untitled Task'}
                      </h1>
                    )}
                  </div>

                  {/* Metadata Fields */}
                  <div className="space-y-3">
                    {/* Assignee */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Assignee
                      </label>
                      <div className="flex-1">
                        <button className="flex items-center gap-2 px-3 py-2 w-full hover:bg-dark-bg3 rounded-lg transition-colors bg-dark-bg2 border border-dark-border text-left">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white font-medium flex-shrink-0">
                            {task.assignee?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm text-dark-text flex-1 truncate">
                            {task.assignee?.name || 'Unassigned'}
                          </span>
                          <X className="w-4 h-4 text-dark-muted opacity-0 hover:opacity-100 flex-shrink-0" />
                        </button>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Due date
                      </label>
                      <div className="flex-1">
                        <button className="flex items-center gap-2 px-3 py-2 w-full hover:bg-dark-bg3 rounded-lg transition-colors bg-dark-bg2 border border-dark-border text-left">
                          <Calendar className="w-4 h-4 text-error flex-shrink-0" />
                          <span className="text-sm text-error flex-1 truncate">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
                          </span>
                          <X className="w-4 h-4 text-dark-muted opacity-0 hover:opacity-100 flex-shrink-0" />
                        </button>
                      </div>
                    </div>

                    {/* Dependencies */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Dependencies
                      </label>
                      <div className="flex-1">
                        <button className="text-sm text-dark-muted hover:text-dark-text transition-colors">
                          Add dependencies
                        </button>
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Projects
                      </label>
                      <div className="flex-1">
                        {task.project ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-dark-bg2 border border-dark-border rounded-lg">
                            <div
                              className="w-3 h-3 rounded-sm flex-shrink-0"
                              style={{ backgroundColor: task.project.color || '#3b82f6' }}
                            />
                            <span className="text-sm text-dark-text flex-1 truncate">
                              {task.project.name}
                            </span>
                            <select className="text-xs text-dark-muted bg-transparent border-none outline-none">
                              <option>To do</option>
                              <option>In Progress</option>
                              <option>Done</option>
                            </select>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-dark-muted">0</span>
                            <button className="p-1 hover:bg-dark-bg3 rounded transition-colors">
                              <Plus className="w-4 h-4 text-dark-muted" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Priority
                      </label>
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-warning text-white border border-warning rounded text-xs font-medium">
                          {task.priority || 'Medium'}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-dark-muted w-24 flex-shrink-0">
                        Status
                      </label>
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary text-white border border-primary rounded text-xs font-medium">
                          {task.status === 'in-progress' ? 'On track' : task.status?.replace('-', ' ') || 'To do'}
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
                        value={localTask?.description || ''}
                        onChange={(e) => setLocalTask({ ...localTask, description: e.target.value })}
                        onBlur={() => {
                          setIsEditing({ ...isEditing, description: false });
                          handleUpdate('description', localTask?.description);
                        }}
                        className="w-full min-h-[80px] p-3 bg-dark-bg2 border border-dark-border rounded-lg text-sm text-dark-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="What is this task about?"
                      />
                    ) : (
                      <div
                        onClick={() => setIsEditing({ ...isEditing, description: true })}
                        className="p-3 min-h-[50px] hover:bg-dark-bg2 rounded-lg cursor-text text-sm text-dark-muted italic"
                      >
                        {localTask?.description || 'What is this task about?'}
                      </div>
                    )}
                  </div>

                  {/* Comments */}
                  <div>
                    {/* Comment Input */}
                    <div className="flex gap-3 mb-4">
                      <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center text-xs text-white font-medium flex-shrink-0">
                        IA
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment"
                          className="w-full p-3 bg-dark-bg2 border border-dark-border rounded-lg text-sm text-dark-text placeholder-dark-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Collaborators */}
                  <div className="pt-4 border-t border-dark-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark-muted">Collaborators</span>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <div className="w-7 h-7 bg-warning rounded-full border-2 border-dark-bg1 flex items-center justify-center text-xs text-white font-medium">
                            IA
                          </div>
                          <div className="w-7 h-7 bg-dark-bg3 border-2 border-dark-bg1 rounded-full" />
                          <div className="w-7 h-7 bg-dark-bg3 border-2 border-dark-bg1 rounded-full" />
                        </div>
                        <button className="w-7 h-7 border-2 border-dashed border-dark-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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

export default TaskDetailSidebar;