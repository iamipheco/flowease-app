/* ======================================================
   src/components/time/ProductivityChart.jsx
   Productivity Chart - Reactive & Backend-Synced
====================================================== */
import { useState, useMemo } from "react";
import { cn } from "../../utils/cn";
import { useTimeEntries } from "../../hooks/useTimeEntries";

const ProductivityChart = () => {
  const { timeEntries, isLoading } = useTimeEntries();
  const [viewMode, setViewMode] = useState("weekly"); // daily, weekly, monthly

  // =============================
  // AGGREGATE DATA FOR CHART
  // =============================
  const chartData = useMemo(() => {
    if (!timeEntries || timeEntries.length === 0) return [];

    const today = new Date();

    if (viewMode === "daily") {
      const hours = [];
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(today);
        hour.setHours(today.getHours() - i, 0, 0, 0);

        const hourEntries = timeEntries.filter((entry) => {
          const entryDate = new Date(entry.startTime);
          return (
            entryDate.getHours() === hour.getHours() &&
            entryDate.toDateString() === hour.toDateString()
          );
        });

        const minutes = hourEntries.reduce((acc, entry) => acc + (entry.duration || 0) / 60, 0);

        hours.push({
          label:
            hour.getHours() === 0
              ? "12a"
              : hour.getHours() < 12
              ? `${hour.getHours()}a`
              : hour.getHours() === 12
              ? "12p"
              : `${hour.getHours() - 12}p`,
          value: Math.round(minutes * 10) / 10,
          isCurrent: hour.getHours() === today.getHours(),
        });
      }
      return { data: hours, unit: "min", maxValue: Math.max(...hours.map((h) => h.value), 60) };
    }

    if (viewMode === "weekly") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weekData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dayEntries = timeEntries.filter((entry) => {
          const entryDate = new Date(entry.startTime);
          return entryDate.toDateString() === date.toDateString();
        });

        const hours = dayEntries.reduce((acc, entry) => acc + (entry.duration || 0) / 3600, 0);

        weekData.push({
          label: days[date.getDay()],
          value: Math.round(hours * 10) / 10,
          isCurrent: date.toDateString() === today.toDateString(),
        });
      }
      return { data: weekData, unit: "h", maxValue: Math.max(...weekData.map((d) => d.value), 8) };
    }

    if (viewMode === "monthly") {
      const monthData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dayEntries = timeEntries.filter((entry) => {
          const entryDate = new Date(entry.startTime);
          return entryDate.toDateString() === date.toDateString();
        });

        const hours = dayEntries.reduce((acc, entry) => acc + (entry.duration || 0) / 3600, 0);

        monthData.push({
          label: date.getDate().toString(),
          value: Math.round(hours * 10) / 10,
          isCurrent: date.toDateString() === today.toDateString(),
        });
      }
      return { data: monthData, unit: "h", maxValue: Math.max(...monthData.map((d) => d.value), 40) };
    }

    return [];
  }, [timeEntries, viewMode]);

  // =============================
  // RENDER
  // =============================
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-dark-text mb-1">
            Productivity
          </h2>
          <p className="text-sm text-dark-muted capitalize">{viewMode} overview</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-dark-bg3 border border-dark-border rounded-lg p-1">
          {["daily", "weekly", "monthly"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-medium transition-colors",
                viewMode === mode
                  ? "bg-primary text-white"
                  : "text-dark-muted hover:text-dark-text"
              )}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-1 sm:gap-2 md:gap-4 overflow-x-auto">
        {isLoading ? (
          <div className="flex-1 text-center text-dark-muted text-sm py-6">Loading...</div>
        ) : (
          chartData.data.map((item, index) => {
            const heightPercent = (item.value / chartData.maxValue) * 100;

            return (
              <div key={index} className="flex-1 min-w-[30px] sm:min-w-[40px] flex flex-col items-center gap-2">
                {/* Bar */}
                <div className="w-full bg-dark-bg3 rounded-t-lg overflow-hidden flex flex-col justify-end h-40">
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-300",
                      item.isCurrent
                        ? "bg-gradient-to-t from-primary to-primary/70"
                        : item.value > 0
                        ? "bg-gradient-to-t from-warning to-warning/70"
                        : "bg-dark-border"
                    )}
                    style={{ height: `${heightPercent}%`, minHeight: item.value > 0 ? "4px" : "0" }}
                  />
                </div>

                {/* Label */}
                <div className="text-center">
                  <div className={cn(
                    "text-[10px] sm:text-xs font-medium",
                    item.isCurrent ? "text-primary" : "text-dark-muted"
                  )}>
                    {item.label}
                  </div>
                  {item.value > 0 && (
                    <div className="text-[10px] sm:text-xs text-dark-muted mt-0.5">
                      {item.value}{chartData.unit}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductivityChart;