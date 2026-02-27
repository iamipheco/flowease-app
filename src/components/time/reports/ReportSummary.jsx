import { useMemo } from "react";
import { Clock, DollarSign, TrendingUp, Target, Zap, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const ReportSummary = ({ entries }) => {
  const stats = useMemo(() => {
    const totalSeconds = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const totalHours = totalSeconds / 3600;

    const billableEntries = entries.filter((e) => e.isBillable);
    const billableSeconds = billableEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const billableHours = billableSeconds / 3600;
    const nonBillableHours = totalHours - billableHours;

    const totalEarnings = entries.reduce((sum, entry) => {
      if (!entry.isBillable) return sum;
      const hours = (entry.duration || 0) / 3600;
      const rate = entry.hourlyRate || 0;
      return sum + hours * rate;
    }, 0);

    // Average hours per day
    const daysWithEntries = new Set(
      entries.map((e) => new Date(e.startTime).toDateString())
    ).size;
    const avgHoursPerDay = daysWithEntries > 0 ? totalHours / daysWithEntries : 0;

    // Most productive day
    const dayHours = {};
    entries.forEach((entry) => {
      const day = new Date(entry.startTime).toLocaleDateString("en-US", { weekday: "long" });
      const hours = (entry.duration || 0) / 3600;
      dayHours[day] = (dayHours[day] || 0) + hours;
    });
    const mostProductiveDay = Object.entries(dayHours).sort((a, b) => b[1] - a[1])[0];

    // Most worked project
    const projectHours = {};
    entries.forEach((entry) => {
      const project = entry.task?.project?.name || entry.project?.name || "No Project";
      const hours = (entry.duration || 0) / 3600;
      projectHours[project] = (projectHours[project] || 0) + hours;
    });
    const topProject = Object.entries(projectHours).sort((a, b) => b[1] - a[1])[0];

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      billableHours: Math.round(billableHours * 10) / 10,
      nonBillableHours: Math.round(nonBillableHours * 10) / 10,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      avgHoursPerDay: Math.round(avgHoursPerDay * 10) / 10,
      sessionCount: entries.length,
      mostProductiveDay: mostProductiveDay ? `${mostProductiveDay[0]} (${Math.round(mostProductiveDay[1] * 10) / 10}h)` : "N/A",
      topProject: topProject ? `${topProject[0]} (${Math.round(topProject[1] * 10) / 10}h)` : "N/A",
    };
  }, [entries]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card"
    >
      <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-4">
        Summary Statistics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="bg-dark-bg2 rounded-lg p-3 sm:p-4 border border-dark-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-dark-muted">{card.label}</p>
              <div className={`p-1.5 rounded-lg ${card.color}/10`}>
                <card.icon className={`w-3.5 h-3.5 ${card.textColor}`} />
              </div>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${card.textColor} mb-0.5 truncate`}>
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