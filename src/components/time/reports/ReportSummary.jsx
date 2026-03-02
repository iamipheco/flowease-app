import { useMemo } from "react";
import {
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

/* ======================================================
   ReportSummary - Modern Dashboard Cards
   Accepts `entries` from API
====================================================== */
const ReportSummary = ({ entries = [] }) => {
  /* =============================
     Compute Stats
  ============================ */
  const stats = useMemo(() => {
    const totalSeconds = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
    const totalHours = totalSeconds / 3600;

    const billableEntries = entries.filter((e) => e.isBillable);
    const billableHours =
      billableEntries.reduce((sum, e) => sum + (e.duration || 0), 0) / 3600;
    const nonBillableHours = totalHours - billableHours;

    const totalEarnings = entries.reduce((sum, e) => {
      if (!e.isBillable) return sum;
      const hours = (e.duration || 0) / 3600;
      const rate = e.hourlyRate || 0;
      return sum + hours * rate;
    }, 0);

    const daysWithEntries = new Set(
      entries.map((e) => new Date(e.startTime).toDateString())
    ).size;
    const avgHoursPerDay = daysWithEntries ? totalHours / daysWithEntries : 0;

    const dayHours = {};
    entries.forEach((e) => {
      const day = new Date(e.startTime).toLocaleDateString("en-US", {
        weekday: "long",
      });
      dayHours[day] = (dayHours[day] || 0) + (e.duration || 0) / 3600;
    });
    const mostProductiveDay = Object.entries(dayHours).sort((a, b) => b[1] - a[1])[0];

    const projectHours = {};
    entries.forEach((e) => {
      const project = e.task?.project?.name || e.project?.name || "No Project";
      projectHours[project] = (projectHours[project] || 0) + (e.duration || 0) / 3600;
    });
    const topProject = Object.entries(projectHours).sort((a, b) => b[1] - a[1])[0];

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      billableHours: Math.round(billableHours * 10) / 10,
      nonBillableHours: Math.round(nonBillableHours * 10) / 10,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      avgHoursPerDay: Math.round(avgHoursPerDay * 10) / 10,
      sessionCount: entries.length,
      mostProductiveDay: mostProductiveDay
        ? `${mostProductiveDay[0]} (${Math.round(mostProductiveDay[1] * 10) / 10}h)`
        : "N/A",
      topProject: topProject
        ? `${topProject[0]} (${Math.round(topProject[1] * 10) / 10}h)`
        : "N/A",
    };
  }, [entries]);

  /* =============================
     Card Configuration
  ============================ */
  const summaryCards = [
    {
      label: "Total Hours",
      value: `${stats.totalHours}h`,
      subValue: `${stats.sessionCount} sessions`,
      icon: Clock,
      color: "bg-primary",
      textColor: "text-primary",
    },
    {
      label: "Billable Hours",
      value: `${stats.billableHours}h`,
      subValue: `${stats.nonBillableHours}h non-billable`,
      icon: DollarSign,
      color: "bg-success",
      textColor: "text-success",
    },
    {
      label: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      subValue: "From billable time",
      icon: TrendingUp,
      color: "bg-success",
      textColor: "text-success",
    },
    {
      label: "Average per Day",
      value: `${stats.avgHoursPerDay}h`,
      subValue: "Daily average",
      icon: Target,
      color: "bg-warning",
      textColor: "text-warning",
    },
    {
      label: "Most Productive",
      value: stats.mostProductiveDay.split(" (")[0],
      subValue: stats.mostProductiveDay.split(" (")[1]?.replace(")", "") || "",
      icon: Zap,
      color: "bg-warning",
      textColor: "text-warning",
    },
    {
      label: "Top Project",
      value: stats.topProject.split(" (")[0],
      subValue: stats.topProject.split(" (")[1]?.replace(")", "") || "",
      icon: Calendar,
      color: "bg-primary",
      textColor: "text-primary",
    },
  ];

  /* =============================
     Render Modern Cards
  ============================ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-5"
    >
      <h3 className="text-lg font-semibold text-dark-text">Summary Statistics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="bg-dark-bg2 rounded-xl p-4 border border-dark-border hover:border-primary/30 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-dark-muted">{card.label}</p>
              <div className={`p-2 rounded-lg ${card.color}/10`}>
                <card.icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${card.textColor} mb-1 truncate`}>
              {card.value}
            </p>
            <p className="text-xs text-dark-muted truncate">{card.subValue}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReportSummary;