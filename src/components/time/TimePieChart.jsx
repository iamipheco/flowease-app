import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { Loader2, PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
  "#e8632a",
  "#4caf50",
  "#e3b341",
  "#3b82f6",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#ec4899",
];

const TimePieChart = () => {
  const { timeEntries, isLoading, error } = useTimeEntries();

  // 🔒 SAFETY
  const safeEntries = Array.isArray(timeEntries) ? timeEntries : [];

  const now = Date.now();

  // 📊 Aggregate time by project safely - TOP 5 ONLY
  const chartData = useMemo(() => {
    if (!safeEntries.length) return [];

    const grouped = {};

    safeEntries.forEach((entry) => {
      if (!entry) return;

      const projectName =
        entry?.task?.project?.name || entry?.project?.name || "No Project";

      const start = entry.clockIn || entry.startTime || entry.start;
      const end = entry.clockOut || entry.endTime || entry.end;

      let durationSeconds = 0;

      if (typeof entry.duration === "number" && entry.duration > 0) {
        durationSeconds = entry.duration;
      } else if (start && !end) {
        const startDate = new Date(start);
        if (!isNaN(startDate.getTime())) {
          durationSeconds = Math.max(
            0,
            Math.floor((now - startDate.getTime()) / 1000),
          );
        }
      } else if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          durationSeconds = Math.max(
            0,
            Math.floor((endDate.getTime() - startDate.getTime()) / 1000),
          );
        }
      }

      if (!Number.isFinite(durationSeconds)) durationSeconds = 0;

      grouped[projectName] = (grouped[projectName] || 0) + durationSeconds;
    });

    let data = Object.entries(grouped)
      .map(([name, totalSeconds]) => {
        const hours = totalSeconds / 3600;
        return {
          name,
          value: +hours.toFixed(2),
          rawSeconds: totalSeconds,
          percentage: 0,
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // <-- ONLY TOP 5 PROJECTS

    const totalHours = data.reduce((sum, item) => sum + item.value, 0);

    data.forEach((item) => {
      item.percentage =
        totalHours > 0 ? +((item.value / totalHours) * 100).toFixed(1) : 0;
    });

    return data;
  }, [safeEntries, now]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];

      return (
        <div className="bg-dark-bg1 border border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-dark-text mb-1">
            {data.name}
          </p>
          <p className="text-xs text-dark-muted">
            {data.value} hours ({data.payload?.percentage || 0}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (!percent || percent < 0.03) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);

    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 🔄 Loading
  if (isLoading) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
          <p className="text-sm text-dark-muted">Loading chart...</p>
        </div>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">⚠️</span>
          </div>
          <p className="text-sm text-error">Failed to load chart</p>
          <p className="text-xs text-dark-muted mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  // 📭 Empty
  if (!chartData.length) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center">
          <PieChartIcon className="w-16 h-16 text-dark-muted mx-auto mb-3 opacity-30" />
          <p className="text-sm text-dark-muted mb-1">No time data yet</p>
          <p className="text-xs text-dark-muted">
            Start tracking time to see your distribution
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-dark-text">
          Time Distribution
        </h3>
        <PieChartIcon className="w-4 h-4 text-dark-muted" />
      </div>
      <div className="flex-1 w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={renderCustomLabel}
              labelLine={false}
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry) => (
                <span className="text-xs text-dark-text">
                  {value} ({entry.payload?.percentage || 0}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimePieChart;