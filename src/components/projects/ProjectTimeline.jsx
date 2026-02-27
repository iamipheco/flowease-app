/* ======================================================
   src/components/projects/ProjectTimeline.jsx
   Timeline View - Gantt Chart for Project Tasks
====================================================== */
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useTasks } from "../../hooks/useTasks";
import { cn } from "../../utils/cn";

const ProjectTimeline = ({ project }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { tasks } = useTasks();

  // Filter tasks for this project
  const projectTasks = tasks.filter(task => task.project?._id === project._id);

  // Generate calendar grid (showing 3 months)
  const months = useMemo(() => {
    const result = [];
    for (let i = -1; i <= 1; i++) {
      const date = new Date(currentMonth);
      date.setMonth(date.getMonth() + i);
      result.push(date);
    }
    return result;
  }, [currentMonth]);

  // Get days in each month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    return { daysInMonth, firstDay, year, month };
  };

  // Calculate task position on timeline
  const getTaskPosition = (task) => {
    if (!task.startDate || !task.dueDate) return null;

    const start = new Date(task.startDate);
    const end = new Date(task.dueDate);
    const firstMonth = months[0];
    
    // Calculate days from start of timeline
    const timelineStart = new Date(firstMonth.getFullYear(), firstMonth.getMonth(), 1);
    const startDay = Math.floor((start - timelineStart) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return { startDay, duration };
  };

  // Navigate months
  const previousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const today = () => {
    setCurrentMonth(new Date());
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'todo': 'bg-blue-500',
      'in-progress': 'bg-warning',
      'review': 'bg-primary',
      'completed': 'bg-success',
    };
    return colors[status] || 'bg-dark-muted';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark-text mb-1">Timeline</h2>
          <p className="text-sm text-dark-muted">
            {projectTasks.length} tasks scheduled
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={today} className="btn btn-secondary btn-sm">
            <Calendar className="w-4 h-4" />
            Today
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-dark-bg2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-dark-text" />
            </button>
            <span className="text-sm font-medium text-dark-text px-4">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-dark-bg2 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-dark-text" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="bg-dark-bg2 border border-dark-border rounded-lg overflow-hidden">
        {/* Month Headers */}
        <div className="grid grid-cols-3 border-b border-dark-border bg-dark-bg3">
          {months.map((month, idx) => (
            <div key={idx} className="px-4 py-3 text-center border-r border-dark-border last:border-r-0">
              <div className="text-sm font-semibold text-dark-text">
                {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-3">
          {months.map((month, monthIdx) => {
            const { daysInMonth, firstDay } = getDaysInMonth(month);
            
            return (
              <div key={monthIdx} className="border-r border-dark-border last:border-r-0">
                {/* Day numbers */}
                <div className="grid grid-cols-7 border-b border-dark-border">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center py-2 text-xs text-dark-muted border-r border-dark-border/50 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar cells */}
                <div className="grid grid-cols-7">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square border-r border-b border-dark-border/50" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const date = new Date(month.getFullYear(), month.getMonth(), i + 1);
                    const isToday = 
                      date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={i}
                        className={cn(
                          "aspect-square border-r border-b border-dark-border/50 flex items-center justify-center text-xs",
                          isToday && "bg-primary/10"
                        )}
                      >
                        <span className={cn(
                          isToday ? "w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-medium" : "text-dark-text"
                        )}>
                          {i + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tasks List with Gantt Bars */}
      <div className="mt-6 space-y-2">
        <h3 className="text-sm font-semibold text-dark-text mb-4">Tasks</h3>
        
        {projectTasks.length === 0 ? (
          <div className="text-center py-12 bg-dark-bg2 border border-dark-border rounded-lg">
            <Calendar className="w-12 h-12 text-dark-muted mx-auto mb-3" />
            <p className="text-dark-muted mb-2">No tasks scheduled yet</p>
            <button className="btn btn-primary btn-sm">
              <Plus className="w-4 h-4" />
              Add first task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projectTasks.map((task) => {
              const position = getTaskPosition(task);
              
              return (
                <div
                  key={task._id}
                  className="bg-dark-bg2 border border-dark-border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        getStatusColor(task.status)
                      )} />
                      <span className="text-sm font-medium text-dark-text">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark-muted">
                      {task.startDate && (
                        <span>
                          {new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      {task.startDate && task.dueDate && <span>→</span>}
                      {task.dueDate && (
                        <span>
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-medium">
                            {task.assignee.name?.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gantt Bar */}
                  {position && (
                    <div className="relative h-8 bg-dark-bg3 rounded mt-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(position.duration / 90) * 100}%` }}
                        className={cn(
                          "absolute h-full rounded",
                          getStatusColor(task.status)
                        )}
                        style={{
                          left: `${(position.startDay / 90) * 100}%`,
                          maxWidth: '100%'
                        }}
                      />
                    </div>
                  )}

                  {!task.startDate && !task.dueDate && (
                    <div className="mt-3 text-xs text-dark-muted italic">
                      No dates set
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimeline;