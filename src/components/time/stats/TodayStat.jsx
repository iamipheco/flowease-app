import { Calendar as CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTimeEntries } from "../../../hooks/useTimeEntries";
import { useWorkspaces } from "../../../hooks/useWorkspaces";

const TodayStats = () => {
  const { todayEntries = [], todayHours = 0, todayMinutes = 0, isLoading } = useTimeEntries();
  const { dailyGoal } = useWorkspaces();

  const sessionCount = todayEntries?.length || 0;
  const progressPercent = Math.min(Math.round((todayHours / dailyGoal) * 100), 100);

  if (isLoading) {
    return (
      <motion.div
        className="card p-4 flex flex-col justify-center items-center h-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-dark-muted">Loading today's stats...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card p-4 flex flex-col justify-between h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-dark-text">Today's Stats</h3>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
          <CalendarIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Hours */}
      <div className="text-3xl font-bold text-dark-text mb-1">
        {todayHours}:{String(todayMinutes).padStart(2, "0")}h
      </div>

      {/* Sessions */}
      <p className="text-xs text-dark-muted mb-3">
        {sessionCount} session{sessionCount !== 1 ? "s" : ""} | {progressPercent}% of {dailyGoal}h goal
      </p>

      {/* Progress Bar */}
      <div className="mt-auto">
        <div className="h-1.5 bg-dark-bg3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TodayStats;