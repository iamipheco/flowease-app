import { AlertCircle, Clock, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ActiveTimerBanner = ({ activeEntry, onStop }) => {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (!activeEntry || dismissed) return null;

  // Calculate elapsed time
  const start = new Date(activeEntry.startTime);
  const now = new Date();
  const elapsed = Math.floor((now - start) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-warning/10 border border-warning/30 rounded-lg p-3 sm:p-4 mb-4"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="p-2 bg-warning/20 rounded-lg flex-shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-sm font-semibold text-dark-text flex items-center gap-2">
                  <span>Timer Running</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-warning"></span>
                  </span>
                </h4>
                <p className="text-xs text-dark-muted mt-0.5">
                  {activeEntry.task?.title || activeEntry.description || "Untitled task"}
                </p>
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => setDismissed(true)}
                className="p-1 hover:bg-dark-bg3 rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-dark-muted" />
              </button>
            </div>

            {/* Time and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="text-sm font-mono font-semibold text-warning">
                {hours}h {minutes}m elapsed
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/dashboard/time")}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Go to Timer
                </button>
                <span className="text-dark-muted">•</span>
                <button
                  onClick={() => {
                    if (window.confirm("Stop the running timer?")) {
                      onStop();
                    }
                  }}
                  className="text-xs text-error hover:underline font-medium"
                >
                  Stop Timer
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActiveTimerBanner;