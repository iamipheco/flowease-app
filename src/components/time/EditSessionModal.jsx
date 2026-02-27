import { useState, useEffect } from "react";
import { X, Clock, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../../hooks/useTasks";
import { cn } from "../../utils/cn";

const EditSessionModal = ({ isOpen, onClose, session, onSubmit, isLoading }) => {
  const { tasks } = useTasks();
  const [formData, setFormData] = useState({
    task: "",
    description: "",
    startTime: "",
    endTime: "",
    date: "",
  });

  useEffect(() => {
    if (session) {
      const startDate = new Date(session.startTime);
      const endDate = session.endTime ? new Date(session.endTime) : new Date();

      setFormData({
        task: session.task?._id || "",
        description: session.description || "",
        startTime: startDate.toTimeString().slice(0, 5), // HH:MM
        endTime: session.endTime ? endDate.toTimeString().slice(0, 5) : "",
        date: startDate.toISOString().split("T")[0], // YYYY-MM-DD
      });
    }
  }, [session]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine date and time
    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = formData.endTime
      ? new Date(`${formData.date}T${formData.endTime}`)
      : null;

    // Calculate duration in seconds
    const duration = endDateTime
      ? Math.floor((endDateTime - startDateTime) / 1000)
      : null;

    onSubmit({
      id: session._id,
      data: {
        task: formData.task,
        description: formData.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime ? endDateTime.toISOString() : null,
        duration,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-dark-bg2 rounded-xl shadow-2xl w-full max-w-lg border border-dark-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-dark-border">
                <h2 className="text-lg sm:text-xl font-semibold text-dark-text">
                  Edit Time Entry
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-muted" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                {/* Task Selector */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Task
                  </label>
                  <select
                    name="task"
                    value={formData.task}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select a task</option>
                    {tasks.map((task) => (
                      <option key={task._id} value={task._id}>
                        {task.title}
                        {task.project && ` - ${task.project.name}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Description (optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-dark-muted" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add notes about this session..."
                      className="input pl-10 w-full min-h-[80px] resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="input pl-10 w-full"
                      required
                    />
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Start Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="input pl-10 w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      End Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="input pl-10 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration Preview */}
                {formData.startTime && formData.endTime && (
                  <div className="bg-dark-bg3 border border-dark-border rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-muted">Duration</span>
                      <span className="font-semibold text-dark-text">
                        {(() => {
                          const start = new Date(`${formData.date}T${formData.startTime}`);
                          const end = new Date(`${formData.date}T${formData.endTime}`);
                          const diff = Math.floor((end - start) / 1000);
                          const hours = Math.floor(diff / 3600);
                          const minutes = Math.floor((diff % 3600) / 60);
                          return `${hours}h ${minutes}m`;
                        })()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-dark-bg3 hover:bg-dark-border text-dark-text rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditSessionModal;