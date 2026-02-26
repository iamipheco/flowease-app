import { useState } from 'react';
import { Play, Trash2, Edit2, MoreVertical, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { formatDuration, formatDate } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const TimeEntryList = ({ entries = [], onDelete, onEdit, onContinue }) => {
  const [expandedEntry, setExpandedEntry] = useState(null);

  // If no entries, show empty state
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-dark-bg3 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-10 h-10 text-dark-muted" />
        </div>
        <h3 className="text-xl font-display font-bold text-dark-text mb-2">
          No time entries yet
        </h3>
        <p className="text-sm text-dark-muted mb-6">
          Start tracking your time to see entries here
        </p>
        <button
          onClick={() => window.location.hash = '#timer'}
          className="btn btn-primary"
        >
          Start Timer
        </button>
      </div>
    );
  }

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = formatDate(entry.clockIn || entry.startTime, 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => 
    new Date(b) - new Date(a)
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => {
        const dateEntries = groupedEntries[date];
        const totalMinutes = dateEntries.reduce((sum, e) => sum + (e.duration || 0), 0);

        return (
          <div key={date} className="space-y-3">
            {/* Date Header */}
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {formatDate(date, 'EEEE, MMM dd, yyyy')}
              </h3>
              <div className="text-sm font-medium text-dark-text">
                Total: {formatDuration(totalMinutes)}
              </div>
            </div>

            {/* Entries */}
            <div className="space-y-2">
              {dateEntries.map((entry) => (
                <motion.div
                  key={entry._id || entry.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-4 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Entry Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {/* Project color dot */}
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ 
                            backgroundColor: entry.project?.color || '#3b82f6' 
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-dark-text truncate">
                            {entry.project?.name || entry.workspace?.name || 'No Project'}
                          </h4>
                          {entry.description && (
                            <p className="text-xs text-dark-muted truncate mt-0.5">
                              {entry.description}
                            </p>
                          )}
                          {entry.task?.name && (
                            <p className="text-xs text-dark-muted truncate mt-0.5">
                              Task: {entry.task.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Time info */}
                      <div className="flex items-center gap-4 text-xs text-dark-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(entry.clockIn || entry.startTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {entry.clockOut || entry.endTime
                            ? new Date(entry.clockOut || entry.endTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Running'}
                        </span>
                        {entry.isBillable && (
                          <span className="badge-success text-[10px]">Billable</span>
                        )}
                      </div>
                    </div>

                    {/* Duration & Actions */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-display font-bold text-dark-text">
                          {formatDuration(entry.duration || 0)}
                        </div>
                      </div>

                      {/* Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setExpandedEntry(expandedEntry === entry._id || expandedEntry === entry.id ? null : entry._id || entry.id)}
                          className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-dark-muted" />
                        </button>

                        <AnimatePresence>
                          {expandedEntry === (entry._id || entry.id) && (
                            <>
                              {/* Backdrop */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setExpandedEntry(null)}
                              />
                              
                              {/* Menu */}
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-48 bg-dark-bg3 border border-dark-border rounded-lg shadow-xl overflow-hidden z-20"
                              >
                                <button
                                  onClick={() => {
                                    onContinue && onContinue(entry);
                                    setExpandedEntry(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-bg2 text-dark-text transition-colors text-left text-sm"
                                >
                                  <Play className="w-4 h-4" />
                                  Continue Timer
                                </button>
                                <button
                                  onClick={() => {
                                    onEdit && onEdit(entry);
                                    setExpandedEntry(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-bg2 text-dark-text transition-colors text-left text-sm"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit Entry
                                </button>
                                <div className="border-t border-dark-border" />
                                <button
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this entry?')) {
                                      onDelete && onDelete(entry._id || entry.id);
                                    }
                                    setExpandedEntry(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-error/10 text-error transition-colors text-left text-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeEntryList;