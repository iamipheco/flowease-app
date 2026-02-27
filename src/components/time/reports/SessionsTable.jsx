import { useState } from "react";
import { Edit2, Trash2, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EditSessionModal from "../EditSessionModal";

const SessionsTable = ({ entries, onDelete, onUpdate, isUpdating, isDeleting }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSession, setEditingSession] = useState(null);
  const entriesPerPage = 20;

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  );

  // Pagination
  const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = sortedEntries.slice(startIndex, endIndex);

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group entries by date
  const groupedEntries = currentEntries.reduce((groups, entry) => {
    const date = formatDate(entry.startTime);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});

  const handleUpdateSession = (data) => {
    onUpdate(data, {
      onSuccess: () => {
        setEditingSession(null);
      },
    });
  };

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card text-center py-12"
      >
        <Clock className="w-12 h-12 text-dark-muted mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-dark-text mb-1">
          No Time Entries Found
        </h3>
        <p className="text-sm text-dark-muted">
          Try adjusting your filters or date range
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-dark-text">
            All Sessions ({entries.length})
          </h3>
          <div className="text-xs text-dark-muted">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-xs font-medium text-dark-muted pb-3">Date</th>
                <th className="text-left text-xs font-medium text-dark-muted pb-3">Task</th>
                <th className="text-left text-xs font-medium text-dark-muted pb-3">Project</th>
                <th className="text-left text-xs font-medium text-dark-muted pb-3">Time</th>
                <th className="text-left text-xs font-medium text-dark-muted pb-3">Duration</th>
                <th className="text-left text-xs font-medium text-dark-muted pb-3">Billable</th>
                <th className="text-right text-xs font-medium text-dark-muted pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentEntries.map((entry, index) => {
                  const projectColor = entry.task?.project?.color || entry.project?.color || "#3b82f6";

                  return (
                    <motion.tr
                      key={entry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-dark-border/50 hover:bg-dark-bg3/50 transition-colors"
                    >
                      <td className="py-3 text-sm text-dark-text">
                        {formatDate(entry.startTime)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-1 h-8 rounded"
                            style={{ backgroundColor: projectColor }}
                          />
                          <span className="text-sm text-dark-text font-medium">
                            {entry.task?.title || entry.description || "Untitled"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-dark-muted">
                        {entry.task?.project?.name || entry.project?.name || "-"}
                      </td>
                      <td className="py-3 text-sm text-dark-muted">
                        {formatTime(entry.startTime)} - {entry.endTime ? formatTime(entry.endTime) : "Running"}
                      </td>
                      <td className="py-3 text-sm text-dark-text font-medium">
                        {formatDuration(entry.duration)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            entry.isBillable
                              ? "bg-success/10 text-success"
                              : "bg-dark-bg3 text-dark-muted"
                          }`}
                        >
                          {entry.isBillable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingSession(entry)}
                            className="p-1.5 hover:bg-dark-bg3 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-dark-muted hover:text-primary" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete this ${formatDuration(entry.duration)} session?`)) {
                                onDelete(entry._id);
                              }
                            }}
                            className="p-1.5 hover:bg-dark-bg3 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-dark-muted hover:text-error" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {Object.entries(groupedEntries).map(([date, dateEntries]) => (
            <div key={date}>
              <h4 className="text-xs font-medium text-dark-muted uppercase tracking-wide mb-2">
                {date}
              </h4>
              <div className="space-y-2">
                {dateEntries.map((entry) => {
                  const projectColor = entry.task?.project?.color || entry.project?.color || "#3b82f6";

                  return (
                    <div
                      key={entry._id}
                      className="bg-dark-bg2 rounded-lg p-3 border border-dark-border"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div
                          className="w-1 h-full rounded"
                          style={{ backgroundColor: projectColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark-text mb-1">
                            {entry.task?.title || entry.description || "Untitled"}
                          </p>
                          {(entry.task?.project || entry.project) && (
                            <p className="text-xs text-dark-muted">
                              {entry.task?.project?.name || entry.project?.name}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-dark-text">
                          {formatDuration(entry.duration)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-dark-muted">
                        <span>
                          {formatTime(entry.startTime)} - {entry.endTime ? formatTime(entry.endTime) : "Running"}
                        </span>
                        <div className="flex items-center gap-2">
                          {entry.isBillable && (
                            <span className="text-success">Billable</span>
                          )}
                          <button
                            onClick={() => setEditingSession(entry)}
                            className="p-1 hover:bg-dark-bg3 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete this session?`)) {
                                onDelete(entry._id);
                              }
                            }}
                            className="p-1 hover:bg-dark-bg3 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-error" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-border">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-primary text-white"
                        : "bg-dark-bg3 text-dark-text hover:bg-dark-border"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <EditSessionModal
        isOpen={!!editingSession}
        onClose={() => setEditingSession(null)}
        session={editingSession}
        onSubmit={handleUpdateSession}
        isLoading={isUpdating}
      />
    </>
  );
};

export default SessionsTable;