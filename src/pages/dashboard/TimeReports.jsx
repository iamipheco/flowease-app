import { useState, useMemo } from "react";
import { ArrowLeft, Download, FileText, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DateRangePicker from "../../components/time/reports/DateRangePicker";
import ReportFilters from "../../components/time/reports/ReportFilters";
import AnalyticsCharts from "../../components/time/reports/AnalyticsCharts";
import SessionsTable from "../../components/time/reports/SessionsTable";
import ReportSummary from "../../components/time/reports/ReportSummary";
import ActiveTimerBanner from "../../components/time/reports/ActiveTimerBanner";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useTasks } from "../../hooks/useTasks";

const TimeReports = () => {
  const navigate = useNavigate();
  const { activeWorkspace } = useWorkspaceStore();
  const { timeEntries, activeEntry, deleteTimer, updateTimer, stopTimer, isUpdating, isDeleting, isStopping } = useTimeEntries();
  const { tasks } = useTasks();

  // Filter states
  const [dateRange, setDateRange] = useState("last30days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedTask, setSelectedTask] = useState("all");
  const [billableFilter, setBillableFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get date range
  const getDateRange = () => {
    const today = new Date();
    const ranges = {
      today: {
        start: new Date(today.setHours(0, 0, 0, 0)),
        end: new Date(today.setHours(23, 59, 59, 999)),
      },
      yesterday: {
        start: new Date(new Date().setDate(today.getDate() - 1)),
        end: new Date(new Date().setDate(today.getDate() - 1)),
      },
      last7days: {
        start: new Date(new Date().setDate(today.getDate() - 6)),
        end: new Date(),
      },
      last30days: {
        start: new Date(new Date().setDate(today.getDate() - 29)),
        end: new Date(),
      },
      thisMonth: {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      },
      lastMonth: {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      },
      custom: {
        start: customStartDate ? new Date(customStartDate) : new Date(new Date().setDate(today.getDate() - 29)),
        end: customEndDate ? new Date(customEndDate) : new Date(),
      },
    };

    return ranges[dateRange] || ranges.last30days;
  };

  // Filter entries based on all filters
  const filteredEntries = useMemo(() => {
    const range = getDateRange();
    
    return timeEntries.filter((entry) => {
      // Date range filter
      const entryDate = new Date(entry.startTime);
      if (entryDate < range.start || entryDate > range.end) return false;

      // Workspace filter
      if (entry.workspace?._id !== activeWorkspace?._id) return false;

      // Project filter
      if (selectedProject !== "all") {
        const entryProjectId = entry.task?.project?._id || entry.project?._id;
        if (entryProjectId !== selectedProject) return false;
      }

      // Task filter
      if (selectedTask !== "all") {
        const entryTaskId = entry.task?._id;
        if (entryTaskId !== selectedTask) return false;
      }

      // Billable filter
      if (billableFilter !== "all") {
        const isBillable = entry.isBillable === true;
        if (billableFilter === "billable" && !isBillable) return false;
        if (billableFilter === "non-billable" && isBillable) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const taskTitle = entry.task?.title?.toLowerCase() || "";
        const description = entry.description?.toLowerCase() || "";
        const projectName = entry.task?.project?.name?.toLowerCase() || entry.project?.name?.toLowerCase() || "";
        
        if (!taskTitle.includes(query) && !description.includes(query) && !projectName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [timeEntries, dateRange, customStartDate, customEndDate, selectedProject, selectedTask, billableFilter, searchQuery, activeWorkspace]);

  // Get unique projects
  const projects = useMemo(() => {
    const projectsSet = new Map();
    timeEntries.forEach((entry) => {
      const project = entry.task?.project || entry.project;
      if (project && project._id) {
        projectsSet.set(project._id, project);
      }
    });
    return Array.from(projectsSet.values());
  }, [timeEntries]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Date", "Task", "Project", "Start Time", "End Time", "Duration (h)", "Billable", "Rate", "Amount"];
    const rows = filteredEntries.map((entry) => {
      const duration = (entry.duration || 0) / 3600;
      const rate = entry.hourlyRate || 0;
      const amount = duration * rate;
      
      return [
        new Date(entry.startTime).toLocaleDateString(),
        entry.task?.title || entry.description || "N/A",
        entry.task?.project?.name || entry.project?.name || "N/A",
        new Date(entry.startTime).toLocaleTimeString(),
        entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : "Running",
        duration.toFixed(2),
        entry.isBillable ? "Yes" : "No",
        rate.toFixed(2),
        amount.toFixed(2),
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `time-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/time")}
            className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-dark-muted" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-dark-text">
              Time Reports & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-dark-muted mt-1">
              Detailed insights and history
            </p>
          </div>
        </div>

        <button
          onClick={exportToCSV}
          disabled={filteredEntries.length === 0}
          className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto sm:self-end disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Active Timer Warning Banner */}
      <ActiveTimerBanner
        activeEntry={activeEntry}
        onStop={() => activeEntry && stopTimer(activeEntry._id)}
      />

      {/* Filters Section */}
      <div className="grid grid-cols-1 gap-4">
        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
        />

        <ReportFilters
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          billableFilter={billableFilter}
          setBillableFilter={setBillableFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          projects={projects}
          tasks={tasks}
        />
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts
        entries={filteredEntries}
        dateRange={getDateRange()}
      />

      {/* Summary Stats */}
      <ReportSummary entries={filteredEntries} />

      {/* Sessions Table */}
      <SessionsTable
        entries={filteredEntries}
        onDelete={deleteTimer}
        onUpdate={updateTimer}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TimeReports;