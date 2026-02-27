import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SwitchTaskConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentTask, 
  newTask,
  isLoading 
}) => {
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
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-dark-bg2 rounded-xl shadow-2xl w-full max-w-md border border-dark-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Warning Icon */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-warning/10 rounded-full flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-dark-text mb-1">
                      Switch Task?
                    </h3>
                    <p className="text-sm text-dark-muted">
                      You currently have a timer running. Do you want to switch to a different task?
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-dark-bg3 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-dark-muted" />
                  </button>
                </div>

                {/* Current vs New Task */}
                <div className="mt-4 space-y-3">
                  {/* Current Task */}
                  <div className="bg-dark-bg3 rounded-lg p-3 border border-dark-border">
                    <p className="text-xs text-dark-muted mb-1">Current Task</p>
                    <p className="text-sm font-medium text-dark-text">
                      {currentTask?.title || "Untitled Task"}
                    </p>
                    {currentTask?.project && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: currentTask.project.color || "#3b82f6" }}
                        />
                        <span className="text-xs text-dark-muted">
                          {currentTask.project.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="text-dark-muted">↓</div>
                  </div>

                  {/* New Task */}
                  <div className="bg-primary/10 rounded-lg p-3 border border-primary/30">
                    <p className="text-xs text-primary/70 mb-1">New Task</p>
                    <p className="text-sm font-medium text-dark-text">
                      {newTask?.title || "Untitled Task"}
                    </p>
                    {newTask?.project && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: newTask.project.color || "#3b82f6" }}
                        />
                        <span className="text-xs text-dark-muted">
                          {newTask.project.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-4 bg-dark-bg3 rounded-lg p-3 border-l-4 border-warning">
                  <p className="text-xs text-dark-muted">
                    The current timer will be stopped and saved automatically, and a new timer will start for the selected task.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-dark-bg3 hover:bg-dark-border text-dark-text rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Switching..." : "Switch Task"}
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

export default SwitchTaskConfirmModal;