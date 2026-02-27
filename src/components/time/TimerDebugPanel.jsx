/* ======================================================
   src/components/time/TimerDebugPanel.jsx
   Debug Panel - Remove after testing
====================================================== */
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { useWorkspaceStore } from '../../store/workspaceStore';

const TimerDebugPanel = () => {
  const { activeWorkspace } = useWorkspaceStore();
  const { timeEntries, activeEntry, isLoading } = useTimeEntries();
  const { selectedTask, description, isPaused } = useTimeTrackingStore();

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-md z-50">
      <h3 className="font-bold mb-2 text-yellow-400">🐛 Debug Panel</h3>
      
      <div className="space-y-2">
        <div>
          <span className="text-gray-400">Workspace:</span>{' '}
          <span className="text-green-400">{activeWorkspace?.name || 'None'}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Loading:</span>{' '}
          <span className={isLoading ? 'text-yellow-400' : 'text-green-400'}>
            {isLoading ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">Total Entries:</span>{' '}
          <span className="text-blue-400">{timeEntries.length}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Active Entry:</span>{' '}
          <span className={activeEntry ? 'text-green-400' : 'text-red-400'}>
            {activeEntry ? 'YES' : 'NO'}
          </span>
        </div>
        
        {activeEntry && (
          <div className="pl-4 border-l-2 border-green-400">
            <div>ID: {activeEntry._id?.slice(-8)}</div>
            <div>Task: {activeEntry.task?.title || 'N/A'}</div>
            <div>Start: {new Date(activeEntry.startTime).toLocaleTimeString()}</div>
            <div>Elapsed: {Math.floor((new Date() - new Date(activeEntry.startTime)) / 1000)}s</div>
          </div>
        )}
        
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="text-gray-400 mb-1">Zustand State:</div>
          <div>Selected: {selectedTask?.title || 'None'}</div>
          <div>Description: {description ? `"${description.slice(0, 20)}..."` : 'Empty'}</div>
          <div>Paused: {isPaused ? 'Yes' : 'No'}</div>
        </div>
        
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="text-gray-400 mb-1">Recent Entries:</div>
          {timeEntries.slice(0, 3).map((entry, i) => (
            <div key={entry._id} className="text-xs">
              {i + 1}. {entry.task?.title} - {entry.endTime ? '✅' : '⏱️'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimerDebugPanel;