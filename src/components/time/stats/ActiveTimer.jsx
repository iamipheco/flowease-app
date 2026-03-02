import { Zap } from "lucide-react";
import { motion } from "framer-motion";

const ActiveTimer = ({ activeEntry }) => {
  return (
    <motion.div className="card p-4 cursor-default">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-dark-text">Active Timer</h3>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            activeEntry ? "bg-primary/10 text-primary" : "bg-dark-bg3 text-dark-muted"
          }`}
        >
          <Zap className="w-4 h-4" />
        </div>
      </div>
      <div className="text-3xl font-bold text-dark-text mb-1">
        {activeEntry ? "Running" : "Stopped"}
      </div>
      <p className="text-xs text-dark-muted">
        {activeEntry ? "In progress" : "Not tracking"}
      </p>
    </motion.div>
  );
};

export default ActiveTimer;