import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ViewReport = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      role="button"
      tabIndex={0}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => navigate("/dashboard/time/reports")}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate("/dashboard/time/reports");
      }}
      className="
        card
        h-full
        cursor-pointer
        transition-all
        duration-300
        border
        hover:border-primary/40
        hover:bg-primary/5
        hover:shadow-lg
      "
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-dark-text">
          View Reports
        </h3>

        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <p className="text-xs text-dark-muted">
        History, analytics & performance charts
      </p>
    </motion.div>
  );
};

export default ViewReport;