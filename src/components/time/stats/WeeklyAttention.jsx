import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTimeEntries } from "../../../hooks/useTimeEntries";
import { useWorkspaces } from "../../../hooks/useWorkspaces";

const WeeklyAttention = () => {
  const { weekHours = 0, weekMinutes = 0, isLoading } = useTimeEntries();
  const { weeklyGoal } = useWorkspaces();

  const progressPercent = Math.min(Math.round((weekHours / weeklyGoal) * 100), 100);

  if (isLoading) {
    return (
      <motion.div
        className="card p-4 flex flex-col justify-center items-center h-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-dark-muted">Loading weekly stats...</p>
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
        <h3 className="text-sm font-semibold text-dark-text">Weekly Attention</h3>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-success/10 text-success">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      {/* Hours */}
      <div className="text-3xl font-bold text-dark-text mb-1">
        {weekHours}h {weekMinutes}m
      </div>
      <p className="text-xs text-dark-muted">This week  |  {progressPercent}% of {weeklyGoal}h goal </p>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="h-1.5 bg-dark-bg3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-success transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
       
      </div>
    </motion.div>
  );
};

export default WeeklyAttention;