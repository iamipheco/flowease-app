/* ======================================================
   src/components/projects/ProjectOverview.jsx
   Project Overview - Stats, Description, Recent Activity
====================================================== */
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useTasks } from "../../hooks/useTasks";

const ProjectOverview = ({ project }) => {
  const { tasks } = useTasks();

  // Filter tasks for this project
  const projectTasks = tasks.filter(task => task.project?._id === project._id);

  // Calculate stats
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = projectTasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = projectTasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'completed';
  }).length;

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Recent tasks
  const recentTasks = projectTasks
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  // Upcoming deadlines
  const upcomingDeadlines = projectTasks
    .filter(t => t.dueDate && t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-muted">Total Tasks</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-dark-text">{totalTasks}</div>
        </div>

        <div className="card bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-muted">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="text-3xl font-bold text-success">{completedTasks}</div>
        </div>

        <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-muted">In Progress</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-3xl font-bold text-warning">{inProgressTasks}</div>
        </div>

        <div className="card bg-gradient-to-br from-error/10 to-error/5 border-error/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-muted">Overdue</span>
            <AlertCircle className="w-4 h-4 text-error" />
          </div>
          <div className="text-3xl font-bold text-error">{overdueTasks}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Progress</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-dark-muted">Overall completion</span>
                <span className="text-dark-text font-medium">{progress}%</span>
              </div>
              <div className="h-3 bg-dark-bg3 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-dark-bg2 rounded-lg">
                <div className="text-xs text-dark-muted mb-1">To Do</div>
                <div className="text-xl font-bold text-dark-text">
                  {projectTasks.filter(t => t.status === 'todo').length}
                </div>
              </div>
              <div className="text-center p-3 bg-dark-bg2 rounded-lg">
                <div className="text-xs text-dark-muted mb-1">In Progress</div>
                <div className="text-xl font-bold text-warning">
                  {inProgressTasks}
                </div>
              </div>
              <div className="text-center p-3 bg-dark-bg2 rounded-lg">
                <div className="text-xs text-dark-muted mb-1">Done</div>
                <div className="text-xl font-bold text-success">
                  {completedTasks}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-text mb-3">Description</h3>
            <p className="text-dark-text leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Tasks</h3>
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map(task => (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 p-3 hover:bg-dark-bg2 rounded-lg transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-success' :
                      task.status === 'in-progress' ? 'bg-warning' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-dark-text">
                        {task.title}
                      </div>
                      <div className="text-xs text-dark-muted">
                        {task.assignee?.name || 'Unassigned'}
                      </div>
                    </div>
                    <div className="text-xs text-dark-muted">
                      {task.status?.replace('-', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-muted italic">No tasks yet</p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Project Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Details</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-dark-muted mb-1">Owner</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {project.owner?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm text-dark-text">
                    {project.owner?.name || 'Unassigned'}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs text-dark-muted mb-1">Status</div>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary text-white border border-primary rounded text-xs font-medium">
                  {project.status === 'active' ? 'On track' : project.status}
                </div>
              </div>

              {project.dueDate && (
                <div>
                  <div className="text-xs text-dark-muted mb-1">Due Date</div>
                  <div className="text-sm text-dark-text">
                    {new Date(project.dueDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Team</h3>
            {project.members && project.members.length > 0 ? (
              <div className="space-y-2">
                {project.members.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs text-white font-medium">
                      {member.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-dark-text">{member.name}</div>
                      <div className="text-xs text-dark-muted">{member.role || 'Member'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-muted italic">No team members</p>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-text mb-4">
              Upcoming Deadlines
            </h3>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map(task => (
                  <div key={task._id} className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-dark-muted mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-dark-text">{task.title}</div>
                      <div className="text-xs text-dark-muted">
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-muted italic">No upcoming deadlines</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;