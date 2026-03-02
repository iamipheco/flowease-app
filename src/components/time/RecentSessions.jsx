/* ======================================================
   src/components/time/RecentSessions.jsx
   Responsive: Mobile Compact + Desktop Modern
   FIXED: Edit + Delete Logic
===================================================== */

import { motion } from "framer-motion";
import { Play, Edit2, Trash2, Clock, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useTimeTrackingStore } from "../../store/timeTrackingStore";
import { toast } from "sonner";
import EditSessionModal from "./EditSessionModal";
import DeleteSessionModal from "./DeleteSessionModal";

const RecentSessions = () => {
  const navigate = useNavigate();
  const {
    timeEntries,
    deleteEntry,
    updateEntry,
  } = useTimeEntries();

  const { selectTask } = useTimeTrackingStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const deleteId = searchParams.get("delete");

  const sessionToEdit = editId
    ? timeEntries.find((t) => t._id === editId)
    : null;

  const sessionToDelete = deleteId
    ? timeEntries.find((t) => t._id === deleteId)
    : null;

  const recentSessions = timeEntries?.slice(0, 5) || [];

  // ================= Helpers =================
  const getDuration = (entry) => {
    if (entry.duration) return entry.duration;
    if (entry.startTime && entry.endTime) {
      return Math.floor(
        (new Date(entry.endTime) - new Date(entry.startTime)) / 1000
      );
    }
    return 0;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // ================= Actions =================

  const handleContinue = (session) => {
    if (!session.task) return;
    selectTask(session.task);
    toast.success(`Task selected: ${session.task.title}`, {
      icon: "▶️",
      duration: 2000,
    });
  };

  const handleEdit = (session) => {
    searchParams.set("edit", session._id);
    setSearchParams(searchParams);
  };

  const handleDelete = (session) => {
    searchParams.set("delete", session._id);
    setSearchParams(searchParams);
  };

  // ================= Empty State =================
  if (recentSessions.length === 0) {
    return (
      <div className="card h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="w-12 h-12 text-dark-muted mx-auto mb-3 opacity-20" />
          <p className="text-sm text-dark-muted">No sessions yet</p>
          <p className="text-xs text-dark-muted mt-1">
            Start tracking to see your sessions here
          </p>
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-border">
        <div>
          <h3 className="text-base font-semibold text-dark-text">
            Recent Sessions
          </h3>
          <p className="hidden sm:block text-xs text-dark-muted mt-0.5">
            Last 5 tracked sessions
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/dashboard/time-tracking/sessions")
          }
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform" />
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {recentSessions.map((session, index) => {
          const duration = getDuration(session);
          const projectColor =
            session.task?.project?.color ||
            session.project?.color ||
            "#3b82f6";

          return (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              {/* ================= MOBILE ================= */}
              <div className="sm:hidden bg-dark-bg2 rounded-lg p-3 border-b transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 flex-1 min-w-0">
                    <div
                      className="w-1 rounded-full"
                      style={{ backgroundColor: projectColor }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-dark-text truncate">
                        {session.task?.title ||
                          session.description ||
                          "Untitled"}
                      </p>
                      <p className="text-xs text-dark-muted truncate">
                        {session.task?.project?.name ||
                          session.project?.name ||
                          "No project"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {formatDuration(duration)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-dark-muted">
                  <span>
                    {formatDate(session.startTime)} •{" "}
                    {formatTime(session.startTime)}
                  </span>

                  <div className="flex gap-2">
                    <Play
                      onClick={() => handleContinue(session)}
                      className="w-4 h-4 text-success"
                    />
                    <Edit2
                      onClick={() => handleEdit(session)}
                      className="w-4 h-4 text-primary"
                    />
                    <Trash2
                      onClick={() => handleDelete(session)}
                      className="w-4 h-4 text-error"
                    />
                  </div>
                </div>
              </div>

              {/* ================= DESKTOP ================= */}
              <div className="hidden sm:flex items-center gap-3 p-2.5 rounded-lg bg-dark-bg2 border-b">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${projectColor}25` }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: projectColor }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-text truncate">
                    {session.task?.title ||
                      session.description ||
                      "Untitled"}
                  </p>
                  <p className="text-xs text-dark-muted truncate">
                    {session.task?.project?.name ||
                      session.project?.name ||
                      "No project"}
                  </p>
                </div>

                <div
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${projectColor}12`,
                    color: projectColor,
                  }}
                >
                  {formatDuration(duration)}
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleContinue(session)}
                    className="p-1.5 rounded-md text-success/70 hover:text-success hover:bg-success/10 transition-all"
                  >
                    <Play className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleEdit(session)}
                    className="p-1.5 rounded-md text-primary/70 hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(session)}
                    className="p-1.5 rounded-md text-error/70 hover:text-error hover:bg-error/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= Edit Modal ================= */}
      <EditSessionModal
        isOpen={!!editId && !!sessionToEdit}
        session={sessionToEdit}
        onClose={() => {
          searchParams.delete("edit");
          setSearchParams(searchParams);
        }}
        onSubmit={async ({ id, data }) => {
          try {
            await updateEntry({ id, data });
            toast.success("Session updated");
          } catch {
            toast.error("Failed to update session");
          } finally {
            searchParams.delete("edit");
            setSearchParams(searchParams);
          }
        }}
      />

      {/* ================= Delete Modal ================= */}
      <DeleteSessionModal
        isOpen={!!deleteId && !!sessionToDelete}
        onClose={() => {
          searchParams.delete("delete");
          setSearchParams(searchParams);
        }}
        onConfirm={async () => {
          try {
            await deleteEntry(sessionToDelete._id);
            toast.success("Session deleted");
          } catch {
            toast.error("Failed to delete session");
          } finally {
            searchParams.delete("delete");
            setSearchParams(searchParams);
          }
        }}
      />
    </div>
  );
};

export default RecentSessions;