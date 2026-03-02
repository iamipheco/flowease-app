import { useEffect, useState, useMemo } from "react";
import TimeTracker from "../../components/time/TimeTracker";
import ProductivityChart from "../../components/time/ProductivityChart";
import TimePieChart from "../../components/time/TimePieChart";
import RecentSessions from "../../components/time/RecentSessions";
import Calendar from "../../components/time/Calendar";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useTimeTrackingStore } from "../../store/timeTrackingStore";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import ViewReport from "../../components/time/stats/ViewReport";
import WeeklyAttention from "../../components/time/stats/WeeklyAttention";
import TodayStats from "../../components/time/stats/TodayStat";
import ActiveTimer from "../../components/time/stats/ActiveTimer";

const TimeTracking = () => {
  const { activeWorkspace } = useWorkspaceStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { timeEntries, isLoading, activeEntry, todayEntries, todayHours, todayMinutes, weekHours, weekMinutes } = useTimeEntries();
  const { tick, elapsedSeconds, syncWithActiveEntry, selectedTask } = useTimeTrackingStore();

  // Sync active entry
  useEffect(() => {
    if (activeEntry) syncWithActiveEntry(activeEntry);
  }, [activeEntry, syncWithActiveEntry]);

  // Live timer
  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [tick]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-400 mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
        
          {/* Header - Fully Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-dark-text mb-1 truncate">
                Time Tracking
              </h1>
              <p className="text-xs sm:text-sm text-dark-muted">
                Track your work hours and productivity
              </p>
            </div>
            <button className="btn btn-secondary btn-sm flex items-center gap-2 justify-center sm:w-auto">
              <Plus className="w-4 h-4" />
              <span>View Analytics</span>
            </button>
          </div>

          {/* Row 1 - Main Cards - Responsive Heights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            
            {/* TimeTracker */}
            <div className="">
              <TimeTracker />
            </div>
            
            {/* ProductivityChart */}
            <div className="h-120 ">
              <ProductivityChart height="h-100 lg:h-120" />
            </div>
            
            {/* TimePieChart */}
            <div className="h-100 lg:h-120">
              <TimePieChart />
            </div>
          </div>

          {/* Row 2 - Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            
            {/* Active Timer */}
            <ActiveTimer />

            {/* Today Stats */}
            <div className="">
              <TodayStats />
            </div>

            {/* Weekly Attention */}
            <div className="">
              <WeeklyAttention />
            </div>

            {/* View Reports */}
            <div className="">
              <ViewReport />
            </div>
          </div>

          {/* Row 3 - Sessions + Calendar - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            
            {/* Sessions List */}
            <div className="lg:col-span-2 ">
              <RecentSessions entries={timeEntries.slice(0, 5)} />
            </div>
            
            {/* Calendar */}
            <div className="">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                timeEntries={timeEntries}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;