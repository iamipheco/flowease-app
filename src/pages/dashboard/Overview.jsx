import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Users,
  FolderKanban,
  Timer,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { format } from "date-fns";

const Overview = () => {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 22) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  // Get emoji based on time
  const getGreetingEmoji = () => {
    const hour = currentTime.getHours();

    if (hour >= 5 && hour < 12) {
      return "☀️"; // Morning
    } else if (hour >= 12 && hour < 17) {
      return "🌤️"; // Afternoon
    } else if (hour >= 17 && hour < 22) {
      return "🌆"; // Evening
    } else {
      return "🌙"; // Night
    }
  };

  // Get first name from full name
  const getFirstName = (fullName) => {
    if (!fullName) return "there";
    return fullName.split(" ")[0];
  };

  const stats = [
    {
      label: "Total Tasks",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "In Progress",
      value: "8",
      change: "+3",
      trend: "up",
      icon: Clock,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      label: "Overdue",
      value: "3",
      change: "-2",
      trend: "down",
      icon: AlertCircle,
      color: "text-error",
      bgColor: "bg-error/10",
    },
    {
      label: "Hours Tracked",
      value: "32.5",
      change: "+8.2h",
      trend: "up",
      icon: Timer,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const recentTasks = [
    {
      id: 1,
      title: "Design new dashboard layout",
      project: "Website Redesign",
      priority: "high",
      dueDate: "2025-02-28",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Update API documentation",
      project: "Backend Development",
      priority: "medium",
      dueDate: "2025-03-01",
      status: "todo",
    },
    {
      id: 3,
      title: "Fix login authentication bug",
      project: "Bug Fixes",
      priority: "urgent",
      dueDate: "2025-02-27",
      status: "in-progress",
    },
  ];

  const upcomingMilestones = [
    {
      id: 1,
      title: "Beta Release",
      date: "2025-03-15",
      progress: 75,
      project: "Mobile App",
    },
    {
      id: 2,
      title: "Client Presentation",
      date: "2025-03-20",
      progress: 40,
      project: "Website Redesign",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header with Time & Date */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-text mb-2">
            {getGreeting()},{" "}
            <span className="text-gradient">{getFirstName(user?.name)}</span>{" "}
            {getGreetingEmoji()}
          </h1>
          <p className="text-dark-muted">
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Time & Date Card */}
        <div className="flex items-center gap-4 bg-dark-bg2 border border-dark-border rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-dark-muted">
            <Clock className="w-4 h-4" />
            <span className="text-lg font-mono font-semibold text-dark-text">
              {format(currentTime, "hh:mm a")}
            </span>
          </div>
          <div className="w-px h-8 bg-dark-border" />
          <div className="flex items-center gap-2 text-dark-muted">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium text-dark-text">
              {format(currentTime, "EEEE, MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-success" : "text-error"
                }`}
              >
                <TrendingUp
                  className={`w-3 h-3 ${stat.trend === "down" ? "rotate-180" : ""}`}
                />
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-dark-text mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-dark-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-dark-text">
              Recent Tasks
            </h2>
            <a
              href="/dashboard/tasks"
              className="text-sm text-primary hover:text-primary-400 font-medium"
            >
              View all
            </a>
          </div>

          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-lg bg-dark-bg3 border border-dark-border hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-5 h-5 rounded border-dark-border bg-dark-bg2 text-primary focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-dark-text group-hover:text-primary transition-colors mb-1">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-dark-muted">
                      <span className="flex items-center gap-1">
                        <FolderKanban className="w-3 h-3" />
                        {task.project}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="card">
          <h2 className="text-xl font-display font-bold text-dark-text mb-6">
            Upcoming Milestones
          </h2>

          <div className="space-y-4">
            {upcomingMilestones.map((milestone) => (
              <div key={milestone.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-dark-text mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-dark-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {milestone.progress}%
                  </span>
                </div>
                <div className="w-full bg-dark-bg3 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-400 rounded-full transition-all"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
                <p className="text-xs text-dark-muted">{milestone.project}</p>
              </div>
            ))}

            <button className="w-full mt-4 btn btn-secondary btn-sm">
              View all milestones
            </button>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card">
        <h2 className="text-xl font-display font-bold text-dark-text mb-6">
          Recent Activity
        </h2>

        <div className="space-y-4">
          {[
            {
              user: "You",
              action: "completed",
              target: "Design system documentation",
              time: "2 hours ago",
            },
            {
              user: "Sarah Chen",
              action: "commented on",
              target: "Mobile app wireframes",
              time: "4 hours ago",
            },
            {
              user: "Mike Johnson",
              action: "assigned you to",
              target: "Backend API integration",
              time: "5 hours ago",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 pb-4 border-b border-dark-border last:border-0 last:pb-0"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark-text">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium text-primary">
                    {activity.target}
                  </span>
                </p>
                <p className="text-xs text-dark-muted mt-0.5">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
