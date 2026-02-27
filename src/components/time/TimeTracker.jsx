/* ======================================================
   src/components/time/TimeTracker.jsx
   Compact Modern Time Tracker - Fixed v5
====================================================== */
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  ChevronDown,
  FileText,
  X,
  Clock,
  Timer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../../hooks/useTasks";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useTimeTrackingStore } from "../../store/timeTrackingStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { cn } from "../../utils/cn";

const TimeTracker = () => {
  const { tasks } = useTasks();
  const { activeWorkspace } = useWorkspaceStore();
  const { activeEntry, startTimer, stopTimer, isStarting, isStopping } =
    useTimeEntries();

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
  const [viewMode, setViewMode] = useState("analog"); // 'analog' or 'digital'
  const intervalRef = useRef(null);

  // =============================
  // HANDLERS
  // =============================
  const handleCheckIn = async () => {
    if (!selectedTask || !activeWorkspace) return;
    await startTimer({
      task: selectedTask._id,
      workspace: activeWorkspace._id,
      description: description || selectedTask.title,
    });
  };

 const handleCheckOut = async () => {
  if (!activeEntry?._id) {
    console.error("No active entry ID for check out", activeEntry);
    return;
  }

  try {
    await stopTimer(activeEntry._id);
  } catch (err) {
    console.error("Failed to stop timer", err);
    alert("Check Out failed. See console for details.");
  }
};

  const handlePause = () => pauseTimer();
  const handleResume = () => resumeTimer();
  const handleTaskSelect = (task) => selectTask(task);

  // =============================
  // ACTIVE TASK DISPLAY FUNCTION
  // =============================
  const renderActiveTaskInfo = () => {
    if (!activeEntry || !selectedTask) return null;

    return (
      <div className="mb-3 p-2 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary rounded flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-dark-text truncate">
            {selectedTask.title}
          </div>
          {description && (
            <p className="text-[10px] text-dark-muted truncate mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-dark-muted" />
              {description}
            </p>
          )}
        </div>
      </div>
    );
  };

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
    clearInterval(intervalRef.current);
    if (activeEntry && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [activeEntry, isPaused]);

  // =============================
  // FORMAT TIME
  // =============================
  const formatTime = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // =============================
  // CLOCK ANGLES
  // =============================
  const safeElapsed =
    typeof elapsed === "number" && !isNaN(elapsed) ? elapsed : 0;
  const secondAngle = (safeElapsed % 60) * 6;
  const minuteAngle = ((safeElapsed % 3600) / 60) * 6;
  const hourAngle = ((safeElapsed % 43200) / 3600) * 30;

  // =============================
  // RENDER
  // =============================
  return (
    <div className="card relative overflow-hidden max-w-[520px] w-full mx-auto">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                activeEntry && !isPaused
                  ? "bg-success animate-pulse"
                  : isPaused
                    ? "bg-warning"
                    : "bg-dark-muted",
              )}
            />
            <h2 className="text-base font-bold text-dark-text">
              {activeEntry ? (isPaused ? "Paused" : "Active") : "Time Tracker"}
            </h2>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-0.5 bg-dark-bg2 border border-dark-border rounded-md p-0.5">
            <button
              onClick={() => setViewMode("analog")}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === "analog"
                  ? "bg-primary text-white"
                  : "text-dark-muted hover:text-dark-text",
              )}
              title="Analog Clock"
            >
              <Clock className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("digital")}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === "digital"
                  ? "bg-primary text-white"
                  : "text-dark-muted hover:text-dark-text",
              )}
              title="Digital Timer"
            >
              <Timer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task Selector / Description */}
        {activeEntry ? (
          renderActiveTaskInfo()
        ) : (
          <>
            {/* Original task selector button */}
            <div className="mb-3 relative">
              <button
                onClick={toggleTaskSelector}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all text-xs",
                  "bg-dark-bg2 border border-dark-border hover:border-primary/50",
                  "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                )}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {selectedTask?.project && (
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          selectedTask.project.color || "#3b82f6",
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "truncate text-xs",
                      selectedTask
                        ? "text-dark-text font-medium"
                        : "text-dark-muted",
                    )}
                  >
                    {selectedTask ? selectedTask.title : "Select task to track"}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-dark-muted transition-transform flex-shrink-0",
                    showTaskSelector && "rotate-180",
                  )}
                />
              </button>

              {/* Task dropdown */}
              <AnimatePresence>
                {showTaskSelector && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={closeTaskSelector}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 mt-1 bg-dark-bg2 border border-dark-border rounded-lg shadow-2xl overflow-hidden z-20 max-h-56 overflow-y-auto"
                    >
                      {tasks
                        .filter((t) => t.status !== "completed")
                        .map((task) => (
                          <button
                            key={task._id}
                            onClick={() => handleTaskSelect(task)}
                            className={cn(
                              "w-full px-3 py-2 hover:bg-dark-bg3 text-left transition-colors",
                              selectedTask?._id === task._id &&
                                "bg-primary/10 border-l-2 border-primary",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {task.project && (
                                <div
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      task.project.color || "#3b82f6",
                                  }}
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
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Description */}
            {selectedTask && showDescriptionField && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 overflow-hidden"
              >
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's your goal?"
                  className={cn(
                    "w-full px-3 py-2 pr-14 rounded-lg resize-none text-xs bg-dark-bg2 border border-dark-border text-dark-text placeholder-dark-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
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
              </motion.div>
            )}
          </>
        )}
        {/* Compact Timer Display */}
        <div className="mb-3">
          <AnimatePresence mode="wait">
            {viewMode === 'analog' ? (
              <motion.div
                key="analog"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-3"
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
                className="flex flex-col items-center justify-center py-6"
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
                (isStarting || isStopping) && "opacity-50 cursor-not-allowed",
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
              (!selectedTask || isStarting || isStopping) &&
                "opacity-50 cursor-not-allowed",
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
    </div>
  );
};

export default TimeTracker;
