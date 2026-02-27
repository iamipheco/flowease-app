import { useMemo } from "react";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const AnalyticsCharts = ({ entries, dateRange }) => {
  // Calculate data for charts
  const chartData = useMemo(() => {
    // Time by Project (Pie Chart Data)
    const projectTime = {};
    entries.forEach((entry) => {
      const projectName = entry.task?.project?.name || entry.project?.name || "No Project";
      const duration = (entry.duration || 0) / 3600;
      projectTime[projectName] = (projectTime[projectName] || 0) + duration;
    });

    // Time by Day (Line Chart Data)
    const dailyTime = {};
    entries.forEach((entry) => {
      const date = new Date(entry.startTime).toLocaleDateString();
      const duration = (entry.duration || 0) / 3600;
      dailyTime[date] = (dailyTime[date] || 0) + duration;
    });

    // Sort daily time by date
    const sortedDailyTime = Object.entries(dailyTime)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-30); // Last 30 days

    return {
      projectTime: Object.entries(projectTime).map(([name, hours]) => ({
        name,
        hours: Math.round(hours * 10) / 10,
      })),
      dailyTime: sortedDailyTime.map(([date, hours]) => ({
        date,
        hours: Math.round(hours * 10) / 10,
      })),
    };
  }, [entries]);

  // Colors for pie chart
  const colors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
  ];

  const maxProjectHours = Math.max(...chartData.projectTime.map((p) => p.hours), 1);
  const maxDailyHours = Math.max(...chartData.dailyTime.map((d) => d.hours), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Time by Project - Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-dark-text">Time by Project</h3>
        </div>

        {chartData.projectTime.length === 0 ? (
          <div className="text-center py-8 text-sm text-dark-muted">
            No data for selected period
          </div>
        ) : (
          <div className="space-y-3">
            {chartData.projectTime.map((project, index) => (
              <div key={project.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-dark-text font-medium truncate">
                    {project.name}
                  </span>
                  <span className="text-dark-muted ml-2">
                    {project.hours}h
                  </span>
                </div>
                <div className="h-2 bg-dark-bg3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(project.hours / maxProjectHours) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Daily Breakdown - Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-dark-text">Daily Breakdown</h3>
        </div>

        {chartData.dailyTime.length === 0 ? (
          <div className="text-center py-8 text-sm text-dark-muted">
            No data for selected period
          </div>
        ) : (
          <div className="h-48 flex items-end justify-between gap-1">
            {chartData.dailyTime.map((day, index) => {
              const heightPercent = (day.hours / maxDailyHours) * 100;
              const isWeekend = new Date(day.date).getDay() === 0 || new Date(day.date).getDay() === 6;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  {/* Bar */}
                  <div className="w-full bg-dark-bg3 rounded-t overflow-hidden flex flex-col justify-end h-40 relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.5, delay: index * 0.02 }}
                      className={`w-full rounded-t ${
                        isWeekend
                          ? "bg-gradient-to-t from-warning/70 to-warning/50"
                          : "bg-gradient-to-t from-primary to-primary/70"
                      }`}
                    />
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-bg2 border border-dark-border rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs pointer-events-none z-10">
                      {day.hours}h
                    </div>
                  </div>

                  {/* Date label - show only every few days on mobile */}
                  {(index % 3 === 0 || chartData.dailyTime.length <= 7) && (
                    <span className="text-[9px] sm:text-[10px] text-dark-muted">
                      {new Date(day.date).getDate()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Project Distribution - Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card md:col-span-2"
      >
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-dark-text">Project Distribution</h3>
        </div>

        {chartData.projectTime.length === 0 ? (
          <div className="text-center py-8 text-sm text-dark-muted">
            No data for selected period
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Pie Chart (simplified representation) */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {(() => {
                  const total = chartData.projectTime.reduce((sum, p) => sum + p.hours, 0);
                  let currentAngle = 0;

                  return chartData.projectTime.map((project, index) => {
                    const percentage = (project.hours / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;

                    // Calculate path
                    const startX = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
                    const startY = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
                    const endX = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
                    const endY = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);
                    const largeArc = angle > 180 ? 1 : 0;

                    currentAngle += angle;

                    return (
                      <path
                        key={index}
                        d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                        fill={colors[index % colors.length]}
                        opacity="0.9"
                      />
                    );
                  });
                })()}
                {/* Center circle */}
                <circle cx="50" cy="50" r="25" fill="currentColor" className="text-dark-bg" />
              </svg>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1">
              {chartData.projectTime.map((project, index) => {
                const total = chartData.projectTime.reduce((sum, p) => sum + p.hours, 0);
                const percentage = ((project.hours / total) * 100).toFixed(1);

                return (
                  <div key={project.name} className="flex items-start gap-2">
                    <div
                      className="w-3 h-3 rounded-sm mt-0.5 flex-shrink-0"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-dark-text truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-dark-muted">
                        {project.hours}h ({percentage}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;