import { useState, useEffect } from "react";
import { Clock, Edit2, Trash2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

/* ======================================================
   SESSION CARD
====================================================== */
const SessionCard = ({ session, now, onEdit, onDelete, onContinue }) => {
  const [showMenu, setShowMenu] = useState(false);

  const isActive = !session.endTime;
  const projectColor =
    session.task?.project?.color ||
    session.project?.color ||
    "#3b82f6";

  // Calculate LIVE duration
  const calculatedDuration = session.endTime
    ? session.duration || 0
    : Math.floor((now - new Date(session.startTime)) / 1000);

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }

    return `${secs}s`;
  };

  // Format time range
  const formatTimeRange = (start, end) => {
    const startTime = new Date(start).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (!end) return `Started at ${startTime}`;

    const endTime = new Date(end).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${startTime} - ${endTime}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "relative p-3 rounded-lg border transition-all",
        isActive
          ? "bg-primary/10 border-primary/40 shadow-md shadow-primary/10"
          : "bg-dark-bg2 border-dark-border hover:bg-dark-bg3"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Color Indicator */}
        <div
          className="w-1 h-full absolute left-0 top-0 bottom-0 rounded-l-lg"
          style={{ backgroundColor: projectColor }}
        />

        <div className="flex-1 min-w-0 pl-2">
          {/* Title + LIVE */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium text-dark-text line-clamp-1 flex items-center gap-2">
              {isActive && (
                <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  LIVE
                </span>
              )}
              {session.task?.title ||
                session.description ||
                "Untitled Session"}
            </h4>

            {/* Animated Duration */}
            <motion.div
              key={calculatedDuration}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap transition-all",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/40 animate-pulse"
                  : "bg-dark-bg3 text-dark-text"
              )}
            >
              {formatDuration(calculatedDuration)}
            </motion.div>
          </div>

          {/* Project */}
          {(session.task?.project || session.project) && (
            <div className="flex items-center gap-1.5 mb-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: projectColor }}
              />
              <span className="text-xs text-dark-muted truncate">
                {session.task?.project?.name ||
                  session.project?.name}
              </span>
            </div>
          )}

          {/* Time Range */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-dark-muted">
              <Clock className="w-3 h-3" />
              <span>
                {formatTimeRange(
                  session.startTime,
                  session.endTime
                )}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {!isActive && (
                <button
                  onClick={() => onContinue?.(session)}
                  className="p-1.5 hover:bg-dark-bg3 rounded transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-dark-muted hover:text-primary" />
                </button>
              )}

              <button
                onClick={() => onEdit(session)}
                className="p-1.5 hover:bg-dark-bg3 rounded transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-dark-muted hover:text-primary" />
              </button>

              <button
                onClick={() =>
                  onDelete(session._id)
                }
                className="p-1.5 hover:bg-dark-bg3 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-dark-muted hover:text-error" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ======================================================
   SESSIONS LIST
====================================================== */
const SessionsList = ({
  sessions = [],
  onEdit,
  onDelete,
  onContinue,
  showAll = false,
}) => {
  const [now, setNow] = useState(Date.now());

  // SINGLE interval for whole list
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const displaySessions = showAll
    ? sessions
    : sessions.slice(0, 5);

  // Dynamic total duration
  const totalDuration = displaySessions.reduce(
    (sum, session) => {
      if (!session.endTime) {
        return (
          sum +
          Math.floor(
            (now - new Date(session.startTime)) /
              1000
          )
        );
      }
      return sum + (session.duration || 0);
    },
    0
  );

  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(
      (seconds % 3600) / 60
    );
    return `${hours}h ${minutes}m`;
  };

  if (!sessions.length) {
    return (
      <div className="card text-center py-8">
        <Clock className="w-8 h-8 mx-auto text-dark-muted mb-3" />
        <p className="text-sm text-dark-muted">
          No time entries yet
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-text">
          Recent Sessions
        </h3>

        <motion.span
          key={totalDuration}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "text-sm font-semibold",
            sessions.some((s) => !s.endTime)
              ? "text-primary animate-pulse"
              : "text-dark-text"
          )}
        >
          {formatTotalDuration(totalDuration)}
        </motion.span>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {displaySessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              now={now}
              onEdit={onEdit}
              onDelete={onDelete}
              onContinue={onContinue}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SessionsList;