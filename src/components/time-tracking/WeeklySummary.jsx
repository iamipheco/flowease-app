import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Clock, DollarSign, Calendar } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

const WeeklySummary = ({ summary }) => {
  // Default data if no summary
  const defaultData = {
    totalHours: 0,
    billableHours: 0,
    byDay: [],
    byProject: [],
  };

  const data = summary || defaultData;

  // Prepare chart data for daily breakdown
  const dailyData = [
    { day: 'Mon', hours: 0, billable: 0 },
    { day: 'Tue', hours: 0, billable: 0 },
    { day: 'Wed', hours: 0, billable: 0 },
    { day: 'Thu', hours: 0, billable: 0 },
    { day: 'Fri', hours: 0, billable: 0 },
    { day: 'Sat', hours: 0, billable: 0 },
    { day: 'Sun', hours: 0, billable: 0 },
  ];

  // Fill with actual data
  data.byDay?.forEach((entry) => {
    const dayIndex = new Date(entry.date).getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Adjust Sunday to end
    if (dailyData[adjustedIndex]) {
      dailyData[adjustedIndex].hours = entry.hours || 0;
      dailyData[adjustedIndex].billable = entry.billableHours || 0;
    }
  });

  // Calculate stats
  const totalMinutes = data.totalHours * 60 || 0;
  const billableMinutes = data.billableHours * 60 || 0;
  const nonBillableMinutes = totalMinutes - billableMinutes;
  const billablePercentage = totalMinutes > 0 ? Math.round((billableMinutes / totalMinutes) * 100) : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-bg2 border border-dark-border rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-dark-text mb-2">{payload[0].payload.day}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-dark-muted">Total:</span>
              <span className="font-semibold text-dark-text">{payload[0].value.toFixed(1)}h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-dark-muted">Billable:</span>
              <span className="font-semibold text-dark-text">{payload[1].value.toFixed(1)}h</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Hours */}
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
              Total Hours
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-dark-text">
            {formatDuration(totalMinutes)}
          </div>
          <div className="flex items-center gap-1 text-xs text-success mt-2">
            <TrendingUp className="w-3 h-3" />
            <span>This week</span>
          </div>
        </div>

        {/* Billable Hours */}
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
              Billable
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-dark-text">
            {formatDuration(billableMinutes)}
          </div>
          <div className="text-xs text-dark-muted mt-2">
            {billablePercentage}% of total
          </div>
        </div>

        {/* Non-Billable Hours */}
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
              Non-Billable
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-dark-text">
            {formatDuration(nonBillableMinutes)}
          </div>
          <div className="text-xs text-dark-muted mt-2">
            {100 - billablePercentage}% of total
          </div>
        </div>

        {/* Average per Day */}
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
              Daily Average
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-dark-text">
            {formatDuration(Math.round(totalMinutes / 7))}
          </div>
          <div className="text-xs text-dark-muted mt-2">
            Per working day
          </div>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="card">
        <h3 className="text-lg font-display font-bold text-dark-text mb-6">
          Weekly Breakdown
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
              <XAxis 
                dataKey="day" 
                stroke="var(--muted)" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--muted)" 
                style={{ fontSize: '12px' }}
                label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: 'var(--muted)' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="billable" fill="var(--color-success)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-dark-muted">Total Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-dark-muted">Billable Hours</span>
          </div>
        </div>
      </div>

      {/* Project Breakdown */}
      {data.byProject && data.byProject.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-display font-bold text-dark-text mb-6">
            Time by Project
          </h3>

          <div className="space-y-3">
            {data.byProject.map((project, index) => {
              const projectMinutes = project.hours * 60 || 0;
              const percentage = totalMinutes > 0 ? Math.round((projectMinutes / totalMinutes) * 100) : 0;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`} />
                      <span className="font-medium text-dark-text">
                        {project.project || 'No Project'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-dark-muted">{percentage}%</span>
                      <span className="font-semibold text-dark-text">
                        {formatDuration(projectMinutes)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-dark-bg3 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklySummary;