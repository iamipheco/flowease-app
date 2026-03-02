/* ======================================================
   src/components/time/TimeTracker.jsx
   Compact Modern Time Tracker - 520x520 with Toast
====================================================== */
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, ChevronDown, FileText, X, Clock, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTasks } from '../../hooks/useTasks';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { cn } from '../../utils/cn';

const TimeTracker = () => {
  const { tasks } = useTasks();
  const { activeWorkspace } = useWorkspaceStore();
  const { 
    activeEntry, 
    startTimer, 
    stopTimer, 
    isStarting, 
    isStopping 
  } = useTimeEntries();

  const {
    selectedTask,
    description,
    isPaused,
    showTaskSelector,
    showDescriptionField,
    selectTask,
    setDescription,
    clearTask,
    toggleTaskSelector,
    closeTaskSelector,
    pauseTimer,
    resumeTimer,
    syncWithActiveEntry,
  } = useTimeTrackingStore();

  const [elapsed, setElapsed] = useState(0);
  const [viewMode, setViewMode] = useState('analog'); // 'analog' or 'digital'
  const [showManualEntry, setShowManualEntry] = useState(false);
  const intervalRef = useRef(null);

  // =============================
  // SYNC STORE WITH ACTIVE ENTRY
  // =============================
  useEffect(() => {
    if (activeEntry) {
      syncWithActiveEntry(activeEntry);
      const start = new Date(activeEntry.startTime).getTime();
      const now = new Date().getTime();
      setElapsed(Math.floor((now - start) / 1000));
    } else {
      setElapsed(0);
    }
  }, [activeEntry, syncWithActiveEntry]);

  // =============================
  // TIMER INTERVAL
  // =============================
  useEffect(() => {
    if (activeEntry && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [activeEntry, isPaused]);

  // =============================
  // FORMAT TIME
  // =============================
  const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  // =============================
  // CLOCK ANGLES
  // =============================
  const safeElapsed = typeof elapsed === 'number' && !isNaN(elapsed) ? elapsed : 0;
  const secondAngle = (safeElapsed % 60) * 6;
  const minuteAngle = ((safeElapsed % 3600) / 60) * 6;
  const hourAngle = ((safeElapsed % 43200) / 3600) * 30;

  // =============================
  // HANDLERS
  // =============================
  const handleCheckIn = async () => {
    if (!selectedTask || !activeWorkspace) return;
    
    try {
      await startTimer({
        task: selectedTask,
        workspace: activeWorkspace._id,
        description: description || selectedTask.title,
      });
      
      // Success toast
      toast.success(`Tracking started: ${selectedTask.title}`, {
        icon: '▶️',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Failed to start tracking');
    }
  };

  const handleCheckOut = async () => {
    if (!activeEntry) return;
    
    try {
      await stopTimer(activeEntry._id);
      
      // Success toast with elapsed time
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const timeStr = hours > 0 
        ? `${hours}h ${minutes}m` 
        : `${minutes}m`;
      
      toast.success(`Tracking stopped: ${timeStr} logged`, {
        icon: '⏹️',
        duration: 4000,
      });
    } catch (error) {
      toast.error('Failed to stop tracking');
    }
  };

  const handlePause = () => {
    pauseTimer();
    toast(`Tracking paused`, {
      icon: '⏸️',
      duration: 2000,
    });
  };

  const handleResume = () => {
    resumeTimer();
    toast.success('Tracking resumed', {
      icon: '▶️',
      duration: 2000,
    });
  };

  const handleTaskSelect = (task) => {
    selectTask(task);
    toast.success(`Task selected: ${task.title}`, {
      icon: '✓',
      duration: 2000,
    });
  };

  // =============================
  // RENDER
  // =============================
  return (
    <div className="card relative overflow-hidden w-full mx-auto">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              activeEntry && !isPaused ? "bg-success animate-pulse" : 
              isPaused ? "bg-warning" : "bg-dark-muted"
            )} />
            <h2 className="text-base font-bold text-dark-text">
              {activeEntry ? (isPaused ? 'Paused' : 'Active') : 'Time Tracker'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Manual Entry Button */}
            <button
              onClick={() => setShowManualEntry(true)}
              className="px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors flex items-center gap-1"
              title="Manual Entry"
            >
              <FileText className="w-3 h-3" />
              <span className="hidden sm:inline">Manual</span>
            </button>

            {/* Compact View Toggle */}
            <div className="flex items-center gap-0.5 bg-dark-bg2 border border-dark-border rounded-md p-0.5">
              <button
                onClick={() => setViewMode('analog')}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === 'analog' 
                    ? "bg-primary text-white" 
                    : "text-dark-muted hover:text-dark-text"
                )}
                title="Analog Clock"
              >
                <Clock className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('digital')}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === 'digital' 
                    ? "bg-primary text-white" 
                    : "text-dark-muted hover:text-dark-text"
                )}
                title="Digital Timer"
              >
                <Timer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Task Selector - Hide when timer is active */}
        {!activeEntry && (
          <div className="mb-3">
            <div className="relative">
              <button
                onClick={toggleTaskSelector}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all text-xs",
                  "bg-dark-bg2 border border-dark-border hover:border-primary/50",
                  "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                )}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {selectedTask?.project && (
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: selectedTask.project.color || '#3b82f6' }}
                    />
                  )}
                  <span className={cn(
                    "truncate text-xs",
                    selectedTask ? "text-dark-text font-medium" : "text-dark-muted"
                  )}>
                    {selectedTask ? selectedTask.title : 'Select task to track'}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "w-3.5 h-3.5 text-dark-muted transition-transform flex-shrink-0",
                  showTaskSelector && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {showTaskSelector && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={closeTaskSelector} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 mt-1 bg-dark-bg2 border border-dark-border rounded-lg shadow-2xl overflow-hidden z-20 max-h-56 overflow-y-auto"
                    >
                      {tasks.length === 0 ? (
                        <div className="px-3 py-6 text-center">
                          <p className="text-xs text-dark-muted">No tasks</p>
                        </div>
                      ) : (
                        <div className="py-1">
                          {tasks.filter(t => t.status !== 'completed').map(task => (
                            <button
                              key={task._id}
                              onClick={() => handleTaskSelect(task)}
                              className={cn(
                                "w-full px-3 py-2 hover:bg-dark-bg3 text-left transition-colors",
                                selectedTask?._id === task._id && "bg-primary/10 border-l-2 border-primary"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {task.project && (
                                  <div
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: task.project.color || '#3b82f6' }}
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-dark-text truncate">
                                    {task.title}
                                  </div>
                                  {task.project && (
                                    <div className="text-[10px] text-dark-muted truncate mt-0.5">
                                      {task.project.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Compact Description */}
        <AnimatePresence>
          {selectedTask && showDescriptionField && !activeEntry && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's your goal?"
                  className={cn(
                    "w-full px-3 py-2 pr-14 rounded-lg resize-none text-xs",
                    "bg-dark-bg2 border border-dark-border",
                    "text-dark-text placeholder-dark-muted",
                    "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  )}
                  rows={2}
                  maxLength={200}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                  <span className="text-[10px] text-dark-muted">
                    {description.length}/200
                  </span>
                  {description && (
                    <button 
                      onClick={clearTask}
                      className="p-0.5 hover:bg-error/10 rounded transition-colors"
                    >
                      <X className="w-2.5 h-2.5 text-error" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Task Display - Compact */}
        {activeEntry && selectedTask && (
          <div className="mb-3 p-2 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary rounded">
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-dark-text truncate">
                  {selectedTask.title}
                </div>
                {description && (
                  <p className="text-[10px] text-dark-muted line-clamp-1 mt-0.5">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compact Timer Display - CONSISTENT HEIGHT */}
        <div className="mb-3 h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {viewMode === 'analog' ? (
              <motion.div
                key="analog"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center"
              >
                {/* Compact Analog Clock */}
                <div className="relative w-44 h-44 mb-2">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.05" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    <circle cx="100" cy="100" r="95" fill="url(#clockGradient)" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.3" />
                    <circle cx="100" cy="100" r="90" fill="var(--bg2)" stroke="var(--border)" strokeWidth="2" />

                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 - 90) * (Math.PI / 180);
                      const x1 = 100 + 75 * Math.cos(angle);
                      const y1 = 100 + 75 * Math.sin(angle);
                      const x2 = 100 + 85 * Math.cos(angle);
                      const y2 = 100 + 85 * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={i % 3 === 0 ? "var(--color-primary)" : "var(--border)"}
                          strokeWidth={i % 3 === 0 ? "3" : "2"}
                          strokeLinecap="round"
                          opacity={i % 3 === 0 ? "1" : "0.5"}
                        />
                      );
                    })}

                    {/* Hour Hand */}
                    <line
                      x1="100" y1="100" x2="100" y2="55"
                      stroke="var(--text)" strokeWidth="6" strokeLinecap="round"
                      transform={`rotate(${hourAngle} 100 100)`}
                      style={{ transition: 'transform 0.5s ease-out' }}
                    />

                    {/* Minute Hand */}
                    <line
                      x1="100" y1="100" x2="100" y2="40"
                      stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round"
                      transform={`rotate(${minuteAngle} 100 100)`}
                      style={{ transition: 'transform 0.5s ease-out' }}
                    />

                    {/* Second Hand */}
                    <line
                      x1="100" y1="100" x2="100" y2="30"
                      stroke={isPaused ? "var(--color-warning)" : "var(--color-success)"}
                      strokeWidth="2" strokeLinecap="round"
                      transform={`rotate(${secondAngle} 100 100)`}
                      style={{ transition: 'transform 0.3s linear' }}
                    />

                    <circle cx="100" cy="100" r="5" fill="var(--color-primary)" filter="url(#glow)" />
                    <circle cx="100" cy="100" r="3" fill="var(--bg)" />
                  </svg>

                  {activeEntry && !isPaused && (
                    <div className="absolute inset-0 rounded-full border-4 border-success/20 animate-pulse" />
                  )}
                </div>

                <div className={cn(
                  "text-2xl font-bold font-mono mb-1",
                  isPaused ? "text-warning" : activeEntry ? "text-success" : "text-dark-text"
                )}>
                  {formatTime(elapsed)}
                </div>
                <div className="text-xs text-dark-muted">
                  {isPaused ? "Paused" : activeEntry ? "Running" : "Not Started"}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="digital"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="relative">
                  {activeEntry && !isPaused && (
                    <div className="absolute inset-0 bg-success/20 blur-3xl rounded-full" />
                  )}
                  <div className={cn(
                    "relative text-5xl font-bold font-mono mb-2 tracking-wider",
                    isPaused ? "text-warning" : activeEntry ? "text-success" : "text-dark-text"
                  )}>
                    {formatTime(elapsed)}
                  </div>
                </div>
                <div className="text-xs text-dark-muted">
                  {isPaused ? "Paused" : activeEntry ? "Running" : "Not Started"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compact Control Buttons */}
        <div className="flex items-center gap-2">
          {activeEntry && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={isPaused ? handleResume : handlePause}
              disabled={isStarting || isStopping}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                "flex items-center justify-center gap-1.5",
                isPaused 
                  ? "bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20" 
                  : "bg-warning hover:bg-warning/90 text-white shadow-lg shadow-warning/20",
                (isStarting || isStopping) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              )}
            </motion.button>
          )}

          <button
            onClick={activeEntry ? handleCheckOut : handleCheckIn}
            disabled={!selectedTask || isStarting || isStopping}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              "flex items-center justify-center gap-1.5",
              activeEntry 
                ? "bg-error hover:bg-error/90 text-white shadow-lg shadow-error/20" 
                : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20",
              (!selectedTask || isStarting || isStopping) && "opacity-50 cursor-not-allowed"
            )}
          >
            {activeEntry ? (
              <>
                <Square className="w-4 h-4" />
                <span>Check Out</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Check In</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {showManualEntry && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManualEntry(false)}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-bg2 border border-dark-border rounded-lg shadow-2xl w-full max-w-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-dark-text">Manual Time Entry</h3>
                  <button
                    onClick={() => setShowManualEntry(false)}
                    className="p-1 hover:bg-dark-bg3 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-dark-muted" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = {
                      task: formData.get('task'),
                      date: formData.get('date'),
                      startTime: formData.get('startTime'),
                      endTime: formData.get('endTime'),
                      description: formData.get('description'),
                    };
                    
                    // Calculate duration
                    const start = new Date(`${data.date}T${data.startTime}`);
                    const end = new Date(`${data.date}T${data.endTime}`);
                    const duration = Math.floor((end - start) / 1000);
                    
                    if (duration <= 0) {
                      toast.error('End time must be after start time');
                      return;
                    }
                    
                    // TODO: Call API to create manual entry
                    console.log('Manual entry:', { ...data, duration });
                    
                    toast.success(`Manual entry added: ${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`);
                    setShowManualEntry(false);
                  }}
                  className="space-y-4"
                >
                  {/* Task Selection */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Task
                    </label>
                    <select
                      name="task"
                      required
                      className="w-full px-3 py-2 bg-dark-bg3 border border-dark-border rounded-lg text-sm text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select a task</option>
                      {tasks.filter(t => t.status !== 'completed').map(task => (
                        <option key={task._id} value={task._id}>
                          {task.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-dark-bg3 border border-dark-border rounded-lg text-sm text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Time Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        required
                        defaultValue="09:00"
                        className="w-full px-3 py-2 bg-dark-bg3 border border-dark-border rounded-lg text-sm text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        required
                        defaultValue="10:00"
                        className="w-full px-3 py-2 bg-dark-bg3 border border-dark-border rounded-lg text-sm text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="What did you work on?"
                      className="w-full px-3 py-2 bg-dark-bg3 border border-dark-border rounded-lg text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowManualEntry(false)}
                      className="flex-1 px-4 py-2 bg-dark-bg3 hover:bg-dark-bg3/80 text-dark-text rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
                    >
                      Add Entry
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeTracker;