import { useEffect } from 'react';
import TimeTracker from '../../components/time/TimeTracker';
import ProductivityChart from '../../components/time/ProductivityChart';
import QuickStats from '../../components/time/QuickStats';
import SessionsList from '../../components/time/SessionsList';
import Calendar from '../../components/time/Calendar';
import TimerDebugPanel from '../../components/time/TimerDebugPanel';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const TimeTracking = () => {
  const { activeWorkspace } = useWorkspaceStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    timeEntries,
    isLoading,
    activeEntry,
    updateEntry,
    deleteEntry,
    refetch,
  } = useTimeEntries();

  const {
    tick,
    elapsedSeconds,
    syncWithActiveEntry,
    startTimer,
    stopTimer,
    selectedTask,
  } = useTimeTrackingStore();

  // --------------------------
  // Auto-sync running timer from server
  // --------------------------
  useEffect(() => {
    if (activeEntry) {
      syncWithActiveEntry(activeEntry);
    }
  }, [activeEntry, syncWithActiveEntry]);

  // --------------------------
  // Live timer increment
  // --------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [tick]);

  // --------------------------
  // Filter today and weekly stats
  // --------------------------
  const todayEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.startTime);
    const today = new Date();
    return (
      entryDate.toDateString() === today.toDateString() &&
      entry.workspace?._id === activeWorkspace?._id
    );
  });

  const totalHoursToday = todayEntries.reduce(
    (acc, entry) => acc + (entry.duration || 0) / 3600,
    0
  );

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weeklyEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.startTime);
    return entryDate >= weekStart && entry.workspace?._id === activeWorkspace?._id;
  });

  const weeklyHours = weeklyEntries.reduce(
    (acc, entry) => acc + (entry.duration || 0) / 3600,
    0
  );

  const sortedEntries = [...timeEntries].sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark-muted">Loading time entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Debug Panel */}
      <TimerDebugPanel elapsedSeconds={elapsedSeconds} selectedTask={selectedTask} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark-text mb-1 sm:mb-2">
            Time Tracking
          </h1>
          <p className="text-sm text-dark-muted">
            Track your work hours and productivity
          </p>
        </div>

        <button className="btn btn-primary flex items-center justify-center sm:justify-start gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Manual Entry</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          <TimeTracker />
          <ProductivityChart timeEntries={timeEntries} />
          <SessionsList
            sessions={sortedEntries}
            onEdit={(session) => console.log('Edit:', session)}
            onDelete={(id) => deleteEntry(id)}
            onContinue={(session) => {
              // Only allow one running timer
              if (!selectedTask) {
                startTimer(session.task, session.description);
              } else {
                alert('Stop the current timer before continuing another session.');
              }
            }}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          <QuickStats
            totalHoursToday={totalHoursToday}
            totalEntries={todayEntries.length}
            activeEntry={activeEntry}
            weeklyHours={weeklyHours}
          />
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            timeEntries={timeEntries}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;