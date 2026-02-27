import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

const DateRangePicker = ({
  dateRange,
  setDateRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}) => {
  const presets = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last7days", label: "Last 7 Days" },
    { value: "last30days", label: "Last 30 Days" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-dark-text">Date Range</h3>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setDateRange(preset.value)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              dateRange === preset.value
                ? "bg-primary text-white"
                : "bg-dark-bg3 text-dark-text hover:bg-dark-border"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Date Inputs */}
      {dateRange === "custom" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-dark-border">
          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="input w-full text-sm"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DateRangePicker;