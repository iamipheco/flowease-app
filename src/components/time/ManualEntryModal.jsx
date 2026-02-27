import { useState } from "react";
import { X, Clock, Calendar, FileText, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../../hooks/useTasks";
import { cn } from "../../utils/cn";

const ManualEntryModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { tasks } = useTasks();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    task: "",
    description: "",
    date: today,
    startTime: "",
    endTime: "",
    isBillable: true,
    hourlyRate: 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.task) {
      newErrors.task = "Task is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    // Validate that end time is after start time
    if (formData.startTime && formData.endTime) {
      const start = new Date(`${formData.date}T${formData.startTime}`);
      const end = new Date(`${formData.date}T${formData.endTime}`);

      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime || !formData.date) {
      return null;
    }

    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);
    const diff = Math.floor((end - start) / 1000); // seconds

    if (diff <= 0) return null;

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return { hours, minutes, seconds: diff };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const duration = calculateDuration();
    if (!duration) {
      setErrors({ endTime: "Invalid time range" });
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    onSubmit({
      task: formData.task,
      description: formData.description,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      duration: duration.seconds,
      isBillable: formData.isBillable,
      hourlyRate: formData.isBillable ? parseFloat(formData.hourlyRate) || 0 : 0,
    });
  };

  const handleClose = () => {
    setFormData({
      task: "",
      description: "",
      date: today,
      startTime: "",
      endTime: "",
      isBillable: true,
      hourlyRate: 0,
    });
    setErrors({});
    onClose();
  };

  const duration = calculateDuration();

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
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-dark-bg2 rounded-xl shadow-2xl w-full max-w-lg border border-dark-border max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-dark-border sticky top-0 bg-dark-bg2 z-10">
                <h2 className="text-lg sm:text-xl font-semibold text-dark-text">
                  Add Manual Time Entry
                </h2>
                <button
                  onClick={handleClose}
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
                    Task <span className="text-error">*</span>
                  </label>
                  <select
                    name="task"
                    value={formData.task}
                    onChange={handleChange}
                    className={cn("input w-full", errors.task && "border-error")}
                  >
                    <option value="">Select a task</option>
                    {tasks.map((task) => (
                      <option key={task._id} value={task._id}>
                        {task.title}
                        {task.project && ` - ${task.project.name}`}
                      </option>
                    ))}
                  </select>
                  {errors.task && (
                    <p className="text-xs text-error mt-1">{errors.task}</p>
                  )}
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
                      placeholder="What did you work on?"
                      className="input pl-10 w-full min-h-[80px] resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Date <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      max={today}
                      className={cn("input pl-10 w-full", errors.date && "border-error")}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-xs text-error mt-1">{errors.date}</p>
                  )}
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Start Time <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className={cn(
                          "input pl-10 w-full",
                          errors.startTime && "border-error"
                        )}
                      />
                    </div>
                    {errors.startTime && (
                      <p className="text-xs text-error mt-1">{errors.startTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      End Time <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className={cn(
                          "input pl-10 w-full",
                          errors.endTime && "border-error"
                        )}
                      />
                    </div>
                    {errors.endTime && (
                      <p className="text-xs text-error mt-1">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                {/* Duration Preview */}
                {duration && (
                  <div className="bg-dark-bg3 border border-dark-border rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-muted">Duration</span>
                      <span className="font-semibold text-primary">
                        {duration.hours}h {duration.minutes}m
                      </span>
                    </div>
                  </div>
                )}

                {/* Billable */}
                <div className="border-t border-dark-border pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isBillable"
                        checked={formData.isBillable}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary bg-dark-bg3 border-dark-border rounded focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-dark-text">
                        Billable
                      </span>
                    </label>
                  </div>

                  {formData.isBillable && (
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Hourly Rate ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                        <input
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="input pl-10 w-full"
                        />
                      </div>
                      {duration && formData.hourlyRate > 0 && (
                        <p className="text-xs text-success mt-1">
                          Total: ${((duration.hours + duration.minutes / 60) * formData.hourlyRate).toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
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
                    {isLoading ? "Saving..." : "Save Entry"}
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

export default ManualEntryModal;