import { useState, useEffect, useRef } from 'react';
import { Plus, History, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTimeTrackerStore } from '../../store/timeTrackerStore';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useWorkspaceStore } from '../../store/workspaceStore';
import ClockTimer from '../../components/time-tracking/ClockTimer';
import TimerSetupForm from '../../components/time-tracking/TimerSetupForm';
import ManualEntryModal from '../../components/time-tracking/ManualEntryModal';
import TimeEntryList from '../../components/time-tracking/TimeEntryList';
import WeeklySummary from '../../components/time-tracking/WeeklySummary';

const TimeTracking = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('timer');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const hasSyncedRef = useRef(false); // Track if we've synced
  const isStoppingRef = useRef(false); // Track if we're stopping

  const { activeWorkspace } = useWorkspaceStore();
  const {
    activeTimer,
    isRunning,
    startTimer: startLocalTimer,
    pauseTimer,
    resumeTimer,
    stopTimer: stopLocalTimer,
  } = useTimeTrackerStore();

  const {
    timeEntries,
    runningTimer,
    weeklySummary,
    isLoading,
    startTimer: startTimerAPI,
    stopTimer: stopTimerAPI,
    createEntry,
    deleteEntry,
    isStarting,
    isStopping,
  } = useTimeTracking();

  // Sync running timer from API on mount ONLY ONCE
  useEffect(() => {
    if (runningTimer && !activeTimer && !hasSyncedRef.current && !isStoppingRef.current) {
      console.log('Syncing running timer from API:', runningTimer);
      hasSyncedRef.current = true;
      
      // Restore timer state from API
      startLocalTimer(
        runningTimer.project?._id || runningTimer.project,
        runningTimer.task?._id || runningTimer.task,
        runningTimer.description || '',
        runningTimer.isBillable !== undefined ? runningTimer.isBillable : true
      );
    }
    
    // Reset sync flag when there's no running timer
    if (!runningTimer && hasSyncedRef.current) {
      hasSyncedRef.current = false;
    }
  }, [runningTimer, activeTimer, startLocalTimer]);

  // Handle task pre-selection from navigation
  useEffect(() => {
    if (location.state?.task) {
      const task = location.state.task;
      handleStartTimer({
        project: task.project._id || task.project,
        task: task._id,
        description: task.title,
        isBillable: true,
      });
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Start timer
  const handleStartTimer = (data) => {
    console.log('Starting timer with:', data);
    
    // Start local timer immediately for UI responsiveness
    startLocalTimer(data.project, data.task, data.description, data.isBillable);

    // Start timer on backend
    startTimerAPI({
      workspace: activeWorkspace._id,
      project: data.project,
      task: data.task,
      description: data.description,
      isBillable: data.isBillable,
    });
  };

  // Pause timer (local only - no API call)
  const handlePauseTimer = () => {
    pauseTimer();
  };

  // Resume timer (local only - no API call)
  const handleResumeTimer = () => {
    resumeTimer();
  };

  // Stop timer
  const handleStopTimer = () => {
    if (!runningTimer?._id) {
      console.error('No running timer ID found');
      stopLocalTimer();
      return;
    }

    console.log('Stopping timer:', runningTimer._id);
    
    // Set stopping flag to prevent re-sync
    isStoppingRef.current = true;
    hasSyncedRef.current = false;
    
    // Stop local timer immediately
    stopLocalTimer();
    
    // Stop on backend
    stopTimerAPI(runningTimer._id);
    
    // Reset stopping flag after a delay
    setTimeout(() => {
      isStoppingRef.current = false;
    }, 2000);
  };

  // Add manual entry
  const handleAddManualEntry = (data) => {
    console.log('Adding manual entry:', data);
    
    const payload = {
      workspace: activeWorkspace._id,
      project: data.project,
      description: data.description,
      clockIn: `${data.date}T${data.startTime}:00`,
      clockOut: `${data.date}T${data.endTime}:00`,
      isBillable: data.isBillable,
    };

    // Only add task if it exists
    if (data.task) {
      payload.task = data.task;
    }

    createEntry(payload);
    setShowManualEntry(false);
  };

  // Continue timer from history
  const handleContinueTimer = (entry) => {
    handleStartTimer({
      project: entry.project?._id || entry.project,
      task: entry.task?._id || entry.task,
      description: entry.description || '',
      isBillable: entry.isBillable !== undefined ? entry.isBillable : true,
    });
    setActiveTab('timer');
  };

  // Delete entry
  const handleDeleteEntry = (id) => {
    deleteEntry(id);
  };

  // Edit entry (TODO: implement edit modal)
  const handleEditEntry = (entry) => {
    console.log('Edit entry:', entry);
    // TODO: Open edit modal with entry data
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-text mb-2">
            Time Tracking
          </h1>
          <p className="text-dark-muted">Track your time and stay productive</p>
        </div>

        <button
          onClick={() => setShowManualEntry(true)}
          className="btn btn-secondary"
        >
          <Plus className="w-4 h-4" />
          Add Manual Entry
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('timer')}
          className={`px-4 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'timer' ? 'text-primary' : 'text-dark-muted hover:text-dark-text'
          }`}
        >
          Timer
          {activeTab === 'timer' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'history' ? 'text-primary' : 'text-dark-muted hover:text-dark-text'
          }`}
        >
          <History className="w-4 h-4" />
          History
          {activeTab === 'history' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reports' ? 'text-primary' : 'text-dark-muted hover:text-dark-text'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Reports
          {activeTab === 'reports' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {!activeTimer ? (
              <TimerSetupForm onStart={handleStartTimer} />
            ) : (
              <ClockTimer
                onStart={handleStartTimer}
                onPause={handlePauseTimer}
                onResume={handleResumeTimer}
                onStop={handleStopTimer}
              />
            )}

            {/* Active Timer Info */}
            {activeTimer && (
              <div className="card max-w-2xl mx-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-dark-text mb-1">
                      Currently tracking
                    </h4>
                    <p className="text-lg font-display font-bold text-primary mb-2">
                      {activeTimer.project || 'No Project'}
                    </p>
                    {activeTimer.description && (
                      <p className="text-sm text-dark-muted">{activeTimer.description}</p>
                    )}
                  </div>
                  {activeTimer.isBillable && (
                    <span className="badge-success">Billable</span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-dark-muted">Loading time entries...</p>
                </div>
              </div>
            ) : (
              <TimeEntryList
                entries={timeEntries}
                onDelete={handleDeleteEntry}
                onEdit={handleEditEntry}
                onContinue={handleContinueTimer}
              />
            )}
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <WeeklySummary summary={weeklySummary} />
          </motion.div>
        )}
      </div>

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        onSubmit={handleAddManualEntry}
      />
    </div>
  );
};

export default TimeTracking;