import { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const TimeReportFilterPanel = ({ projects = [], tasks = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedTask, setSelectedTask] = useState("all");
  const [billableFilter, setBillableFilter] = useState("all");
  const [dateRange, setDateRange] = useState("last30days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

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
      className="card p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-dark-text">Filters & Date Range</h3>
      </div>

      {/* Top Row: Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks, projects..."
          className="input pl-10 w-full text-sm"
        />
      </div>

      {/* Preset Date Buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setDateRange(preset.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              dateRange === preset.value
                ? "bg-primary text-white"
                : "bg-dark-bg3 text-dark-text hover:bg-dark-border"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Dates */}
      {dateRange === "custom" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-dark-border">
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

      {/* Filters: Project / Task / Billable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {/* Project */}
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="input text-sm"
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Task */}
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="input text-sm"
        >
          <option value="all">All Tasks</option>
          {tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </select>

        {/* Billable */}
        <select
          value={billableFilter}
          onChange={(e) => setBillableFilter(e.target.value)}
          className="input text-sm"
        >
          <option value="all">All Entries</option>
          <option value="billable">Billable Only</option>
          <option value="non-billable">Non-Billable Only</option>
        </select>
      </div>
    </motion.div>
  );
};

export default TimeReportFilterPanel;