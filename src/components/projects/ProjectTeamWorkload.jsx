/* ======================================================
   src/components/projects/ProjectTeamWorkload.jsx
   Team Workload - Shows who's working on what
====================================================== */
import { useState } from "react";
import { Users, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTasks } from "../../hooks/useTasks";
import { cn } from "../../utils/cn";

const ProjectTeamWorkload = ({ project }) => {
  const { tasks } = useTasks();
  const [selectedMember, setSelectedMember] = useState(null);

  // Filter tasks for this project
  const projectTasks = tasks.filter(task => task.project?._id === project._id);

  // Get team members (from project.members or extract from tasks)
  const teamMembers = project.members || [];

  // Calculate workload for each member
  const workloadData = teamMembers.map(member => {
    const memberTasks = projectTasks.filter(
      task => task.assignee?._id === member._id || task.assignee?.name === member.name
    );

    const stats = {
      total: memberTasks.length,
      completed: memberTasks.filter(t => t.status === 'completed').length,
      inProgress: memberTasks.filter(t => t.status === 'in-progress').length,
      todo: memberTasks.filter(t => t.status === 'todo').length,
      overdue: memberTasks.filter(t => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate) < new Date() && t.status !== 'completed';
      }).length,
    };

    const completionRate = stats.total > 0 
      ? Math.round((stats.completed / stats.total) * 100) 
      : 0;

    // Calculate workload level (low/medium/high)
    const workloadLevel = 
      stats.total === 0 ? 'none' :
      stats.total <= 3 ? 'low' :
      stats.total <= 7 ? 'medium' :
      'high';

    return {
      member,
      tasks: memberTasks,
      stats,
      completionRate,
      workloadLevel,
    };
  });

  // Unassigned tasks
  const unassignedTasks = projectTasks.filter(task => !task.assignee);

  // Workload color
  const getWorkloadColor = (level) => {
    const colors = {
      none: 'bg-dark-bg3 text-dark-muted',
      low: 'bg-success/20 text-success border-success/30',
      medium: 'bg-warning/20 text-warning border-warning/30',
      high: 'bg-error/20 text-error border-error/30',
    };
    return colors[level] || colors.none;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark-text mb-1">Team Workload</h2>
          <p className="text-sm text-dark-muted">
            {teamMembers.length} team members • {projectTasks.length} total tasks
          </p>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {projectTasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-xs text-dark-muted">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {projectTasks.filter(t => t.status === 'in-progress').length}
            </div>
            <div className="text-xs text-dark-muted">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              {projectTasks.filter(t => {
                if (!t.dueDate) return false;
                return new Date(t.dueDate) < new Date() && t.status !== 'completed';
              }).length}
            </div>
            <div className="text-xs text-dark-muted">Overdue</div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {workloadData.map(({ member, stats, completionRate, workloadLevel }) => (
          <motion.div
            key={member._id || member.name}
            layout
            className={cn(
              "card cursor-pointer transition-all",
              selectedMember === member._id && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedMember(
              selectedMember === member._id ? null : member._id
            )}
          >
            {/* Member Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                {member.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <div className="font-medium text-dark-text">{member.name}</div>
                <div className="text-xs text-dark-muted">{member.role || 'Team Member'}</div>
              </div>
              <div className={cn(
                "px-2 py-1 rounded text-xs font-medium border",
                getWorkloadColor(workloadLevel)
              )}>
                {workloadLevel === 'none' ? 'No tasks' :
                 workloadLevel === 'low' ? 'Light' :
                 workloadLevel === 'medium' ? 'Moderate' :
                 'Heavy'}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-dark-text">{stats.total}</div>
                <div className="text-[10px] text-dark-muted">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-success">{stats.completed}</div>
                <div className="text-[10px] text-dark-muted">Done</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-warning">{stats.inProgress}</div>
                <div className="text-[10px] text-dark-muted">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-error">{stats.overdue}</div>
                <div className="text-[10px] text-dark-muted">Late</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-dark-muted">Completion</span>
                <span className="text-dark-text font-medium">{completionRate}%</span>
              </div>
              <div className="h-2 bg-dark-bg3 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-success rounded-full"
                />
              </div>
            </div>

            {/* Alerts */}
            {stats.overdue > 0 && (
              <div className="flex items-center gap-2 mt-3 px-2 py-1.5 bg-error/10 border border-error/20 rounded text-xs text-error">
                <AlertCircle className="w-3 h-3" />
                <span>{stats.overdue} overdue task{stats.overdue !== 1 ? 's' : ''}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Unassigned Tasks */}
      {unassignedTasks.length > 0 && (
        <div className="card bg-dark-bg2 border-2 border-dashed border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-dark-bg3 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-dark-muted" />
            </div>
            <div>
              <div className="font-medium text-dark-text">Unassigned Tasks</div>
              <div className="text-sm text-dark-muted">
                {unassignedTasks.length} task{unassignedTasks.length !== 1 ? 's' : ''} need assignment
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {unassignedTasks.slice(0, 5).map(task => (
              <div
                key={task._id}
                className="flex items-center gap-3 p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-dark-muted" />
                <span className="text-sm text-dark-text flex-1">{task.title}</span>
                <button className="text-xs text-primary hover:underline">
                  Assign
                </button>
              </div>
            ))}
            {unassignedTasks.length > 5 && (
              <div className="text-xs text-dark-muted text-center pt-2">
                +{unassignedTasks.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {teamMembers.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-dark-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-text mb-2">
            No team members yet
          </h3>
          <p className="text-dark-muted mb-6">
            Add team members to track workload and assign tasks
          </p>
          <button className="btn btn-primary">
            <Users className="w-4 h-4" />
            Add team members
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectTeamWorkload;