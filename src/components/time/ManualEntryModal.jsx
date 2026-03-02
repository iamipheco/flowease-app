/* ======================================================
   src/components/time/ManualEntryModal.jsx
   Modern Sleek Manual Entry Modal - Enhanced Design
====================================================== */
import { useState } from "react";
import { X, Clock, Calendar, FileText, DollarSign, Plus, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTasks } from "../../hooks/useTasks";
import { cn } from "../../utils/cn";

const ManualEntryModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { tasks } = useTasks();
  const navigate = useNavigate();
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
    const diff = Math.floor((end - start) / 1000);

    if (diff <= 0) return null;

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return { hours, minutes, seconds: diff };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const duration = calculateDuration();
    if (!duration) {
      setErrors({ endTime: "Invalid time range" });
      toast.error("End time must be after start time");
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    try {
      await onSubmit({
        task: formData.task,
        description: formData.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration: duration.seconds,
        isBillable: formData.isBillable,
        hourlyRate: formData.isBillable ? parseFloat(formData.hourlyRate) || 0 : 0,
      });
      
      toast.success(`Time entry added: ${duration.hours}h ${duration.minutes}m`, {
        icon: '✓',
        duration: 3000,
      });
      
      handleClose();
    } catch (error) {
      toast.error("Failed to save entry");
    }
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

  const handleCreateTask = () => {
    handleClose();
    navigate('/dashboard/tasks');
    toast.success('Redirecting to tasks...', { icon: '🚀' });
  };

  const duration = calculateDuration();
  const totalAmount = duration && formData.isBillable && formData.hourlyRate > 0
    ? ((duration.hours + duration.minutes / 60) * formData.hourlyRate).toFixed(2)
    : null;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-dark-bg1 rounded-2xl shadow-2xl w-full max-w-lg border border-dark-border/50 max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modern Header with Gradient */}
              <div className="relative bg-gradient-to-br from-primary/10 via-transparent to-transparent border-b border-dark-border/50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-dark-text">
                        Manual Entry
                      </h2>
                      <p className="text-xs text-dark-muted mt-0.5">
                        Add time worked manually
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-dark-muted" />
                  </button>
                </div>
              </div>

              {/* Form Content - Scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Task Selector with Create Button */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-text mb-2">
                      Task <span className="text-error">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="task"
                        value={formData.task}
                        onChange={handleChange}
                        className={cn(
                          "input flex-1 text-sm",
                          "focus:ring-2 focus:ring-primary/50 focus:border-primary",
                          errors.task && "border-error ring-2 ring-error/50"
                        )}
                      >
                        <option value="">Select a task</option>
                        {tasks.map((task) => (
                          <option key={task._id} value={task._id}>
                            {task.title}
                            {task.project && ` - ${task.project.name}`}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleCreateTask}
                        className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
                        title="Create new task"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New</span>
                      </button>
                    </div>
                    {errors.task && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-error mt-1 flex items-center gap-1"
                      >
                        <span className="w-1 h-1 bg-error rounded-full" />
                        {errors.task}
                      </motion.p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-text mb-2">
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-dark-muted pointer-events-none" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What did you work on?"
                        className="input pl-10 w-full min-h-[80px] resize-none text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-text mb-2">
                      Date <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        max={today}
                        className={cn(
                          "input pl-10 w-full text-sm",
                          "focus:ring-2 focus:ring-primary/50 focus:border-primary",
                          errors.date && "border-error ring-2 ring-error/50"
                        )}
                      />
                    </div>
                    {errors.date && (
                      <p className="text-xs text-error mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-error rounded-full" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  {/* Time Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark-text mb-2">
                        Start Time <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" />
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className={cn(
                            "input pl-10 w-full text-sm",
                            "focus:ring-2 focus:ring-primary/50 focus:border-primary",
                            errors.startTime && "border-error ring-2 ring-error/50"
                          )}
                        />
                      </div>
                      {errors.startTime && (
                        <p className="text-xs text-error mt-1">{errors.startTime}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark-text mb-2">
                        End Time <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" />
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className={cn(
                            "input pl-10 w-full text-sm",
                            "focus:ring-2 focus:ring-primary/50 focus:border-primary",
                            errors.endTime && "border-error ring-2 ring-error/50"
                          )}
                        />
                      </div>
                      {errors.endTime && (
                        <p className="text-xs text-error mt-1">{errors.endTime}</p>
                      )}
                    </div>
                  </div>

                  {/* Duration Preview - Enhanced */}
                  {duration && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-dark-muted">Duration</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            {duration.hours}h {duration.minutes}m
                          </div>
                          {totalAmount && (
                            <div className="text-xs text-success mt-0.5">
                              ${totalAmount}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Billable Toggle - Modern */}
                  <div className="border-t border-dark-border/50 pt-5 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          formData.isBillable ? "bg-success/20" : "bg-dark-bg3"
                        )}>
                          <DollarSign className={cn(
                            "w-5 h-5",
                            formData.isBillable ? "text-success" : "text-dark-muted"
                          )} />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-dark-text block">
                            Billable
                          </span>
                          <span className="text-xs text-dark-muted">
                            Track for invoicing
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isBillable"
                          checked={formData.isBillable}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className={cn(
                          "w-11 h-6 rounded-full transition-colors",
                          "peer-checked:bg-success bg-dark-border",
                          "after:content-[''] after:absolute after:top-0.5 after:left-0.5",
                          "after:bg-white after:rounded-full after:h-5 after:w-5",
                          "after:transition-transform peer-checked:after:translate-x-5"
                        )} />
                      </div>
                    </label>

                    <AnimatePresence>
                      {formData.isBillable && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className="block text-sm font-semibold text-dark-text mb-2">
                            Hourly Rate ($)
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" />
                            <input
                              type="number"
                              name="hourlyRate"
                              value={formData.hourlyRate}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="input pl-10 w-full text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </div>

              {/* Footer - Sticky */}
              <div className="border-t border-dark-border/50 p-6 bg-dark-bg2/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 bg-dark-bg3 hover:bg-dark-border text-dark-text rounded-lg font-medium transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm",
                      "bg-primary hover:bg-primary/90 text-white",
                      "shadow-lg shadow-primary/20",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Entry"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ManualEntryModal;