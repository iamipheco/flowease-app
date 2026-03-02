// src/pages/dashboard/SessionsHistory.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Save } from "lucide-react"; // Icons
import { useTimeEntries } from "../../hooks/useTimeEntries";
import EditSessionModal from "../../components/time/EditSessionModal";
import DeleteSessionModal from "../../components/time/DeleteSessionModal";

const SessionsHistory = () => {
  const navigate = useNavigate();
  const {
    timeEntries,
    isLoading,
    updateEntry,
    deleteEntry,
    isUpdating,
    isStarting,
  } = useTimeEntries();

  const [editingSession, setEditingSession] = useState(null);
  const [deletingSession, setDeletingSession] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Pagination slice
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = timeEntries.slice(startIndex, endIndex);

  const totalPages = Math.ceil(timeEntries.length / entriesPerPage);

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-400 mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/time")}
            className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-dark-muted" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-dark-text">All Sessions</h1>
            <p className="text-sm text-dark-muted">View and manage your time entries</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-dark-bg2 rounded-lg border border-dark-border">
          <table className="w-full">
            <thead className="bg-dark-bg3">
              <tr>
                <th className="text-left px-4 py-2 text-xs text-dark-muted">Task</th>
                <th className="text-left px-4 py-2 text-xs text-dark-muted">Project</th>
                <th className="text-left px-4 py-2 text-xs text-dark-muted">Duration</th>
                <th className="text-left px-4 py-2 text-xs text-dark-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full mx-auto" />
                  </td>
                </tr>
              ) : currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-dark-muted">
                    No sessions found.
                  </td>
                </tr>
              ) : (
                currentEntries.map((entry) => (
                  <tr key={entry._id} className="border-b border-dark-border hover:bg-dark-bg3/50 transition-colors">
                    <td className="px-4 py-2">{entry.task?.title || entry.description || "Untitled"}</td>
                    <td className="px-4 py-2">{entry.task?.project?.name || "-"}</td>
                    <td className="px-4 py-2">{Math.floor((new Date(entry.endTime || new Date()) - new Date(entry.startTime)) / 60000)} min</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => setEditingSession(entry)} className="p-1 hover:bg-dark-bg3 rounded">
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button onClick={() => setDeletingSession(entry)} className="p-1 hover:bg-dark-bg3 rounded">
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="btn btn-secondary disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-primary text-white" : "bg-dark-bg3 text-dark-text"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* Modals */}
      <EditSessionModal
        isOpen={!!editingSession}
        session={editingSession}
        onClose={() => setEditingSession(null)}
        onSubmit={updateEntry}
        isLoading={isUpdating}
      />

      <DeleteSessionModal
        isOpen={!!deletingSession}
        session={deletingSession}
        onClose={() => setDeletingSession(null)}
        onDelete={deleteEntry}
      />
    </div>
  );
};

export default SessionsHistory;