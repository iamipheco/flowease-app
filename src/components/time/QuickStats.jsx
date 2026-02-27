import { TrendingUp, Clock, Zap, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const QuickStats = ({ totalHoursToday, totalEntries, activeEntry, weeklyHours = 0 }) => {
  const stats = [
    {
      label: "Today's Productivity",
      value: `${totalHoursToday.toFixed(1)}h`,
      subValue: `${totalEntries} ${totalEntries === 1 ? 'session' : 'sessions'}`,
      icon: TrendingUp,
      color: "bg-success",
      textColor: "text-success",
    },
    {
      label: "Weekly Attended",
      value: weeklyHours ? `${weeklyHours.toFixed(0)}h` : "0h",
      subValue: "This week",
      icon: Clock,
      color: "bg-warning",
      textColor: "text-warning",
    },
    {
      label: "Active Timer",
      value: activeEntry ? "Running" : "Stopped",
      subValue: activeEntry ? "In progress" : "Not tracking",
      icon: Zap,
      color: activeEntry ? "bg-primary" : "bg-dark-bg3",
      textColor: activeEntry ? "text-primary" : "text-dark-muted",
    },
    {
      label: "Detailed Analytics",
      value: "View Reports",
      subValue: "Full history & charts",
      icon: BarChart3,
      color: "bg-primary",
      textColor: "text-primary",
      isAction: true,
      link: "/dashboard/time/reports",
    },
  ];

  return (
    <div className="space-y-3">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {stat.isAction ? (
            // Action Card - Clickable Link
            <Link
              to={stat.link}
              className="card p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group block"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-dark-muted mb-1">{stat.label}</p>
                  <p className={cn(
                    "text-2xl font-bold transition-colors",
                    stat.textColor,
                    "group-hover:text-primary"
                  )}>
                    {stat.value}
                  </p>
                  {stat.subValue && (
                    <p className="text-xs text-dark-muted mt-1">{stat.subValue}</p>
                  )}
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                  `${stat.color}/10`,
                  "group-hover:bg-primary/20"
                )}>
                  <stat.icon className={cn(
                    "w-5 h-5 transition-colors",
                    stat.textColor,
                    "group-hover:text-primary"
                  )} />
                </div>
              </div>
            </Link>
          ) : (
            // Regular Stat Card
            <div className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-dark-muted mb-1">{stat.label}</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    stat.textColor
                  )}>
                    {stat.value}
                  </p>
                  {stat.subValue && (
                    <p className="text-xs text-dark-muted mt-1">{stat.subValue}</p>
                  )}
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  `${stat.color}/10`
                )}>
                  <stat.icon className={cn("w-5 h-5", stat.textColor)} />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;