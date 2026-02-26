import axiosClient from "../../lib/axiosClient";

const timeEntriesAPI = {
  // GET /time-entries - Get all time entries
  getAll: (params = {}) => {
    return axiosClient.get('/time-entries', { params });
  },

  // POST /time-entries - Create manual time entry
  create: (data) => {
    return axiosClient.post('/time-entries', data);
  },

  // GET /time-entries/:id - Get single time entry
  getById: (id) => {
    return axiosClient.get(`/time-entries/${id}`);
  },

  // PUT /time-entries/:id - Update time entry
  update: (id, data) => {
    return axiosClient.put(`/time-entries/${id}`, data);
  },

  // DELETE /time-entries/:id - Delete time entry
  delete: (id) => {
    return axiosClient.delete(`/time-entries/${id}`);
  },

  // POST /time-entries/start - Start timer
  start: (data) => {
    return axiosClient.post('/time-entries/start', data);
  },

  // PUT /time-entries/:id/stop - Stop timer
  stop: (id) => {
    return axiosClient.put(`/time-entries/${id}/stop`);
  },

  // GET /time-entries/running - Get running timer
  getRunning: (params = {}) => {
    return axiosClient.get('/time-entries/running', { params });
  },

  // GET /time-entries/summary/day - Get daily summary
  getDailySummary: (params = {}) => {
    const { date, workspace } = params;
    return axiosClient.get('/time-entries/summary/day', {
      params: { date, workspace },
    });
  },

  // GET /time-entries/summary/week - Get weekly summary
  getWeeklySummary: (params = {}) => {
    const now = new Date();
    const year = now.getFullYear();
    
    // Calculate ISO week number
    const getWeekNumber = (date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };
    
    const week = getWeekNumber(now);
    
    console.log('Fetching weekly summary for:', { year, week, workspace: params.workspace });
    
    return axiosClient.get('/time-entries/summary/week', {
      params: {
        year,
        week,
        workspace: params.workspace,
      },
    });
  },

  // GET /time-entries/summary/month - Get monthly summary
  getMonthlySummary: (params = {}) => {
    const { month, year, workspace } = params;
    return axiosClient.get('/time-entries/summary/month', {
      params: { month, year, workspace },
    });
  },

  // GET /time-entries/project/:projectId - Get entries by project
  getByProject: (projectId, params = {}) => {
    return axiosClient.get(`/time-entries/project/${projectId}`, { params });
  },

  // GET /time-entries/task/:taskId - Get entries by task
  getByTask: (taskId, params = {}) => {
    return axiosClient.get(`/time-entries/task/${taskId}`, { params });
  },

  // GET /time-entries/range - Get entries by date range
  getByDateRange: (params = {}) => {
    return axiosClient.get('/time-entries/range', { params });
  },

  // PUT /time-entries/:id/submit - Submit for approval
  submitForApproval: (id) => {
    return axiosClient.put(`/time-entries/${id}/submit`);
  },

  // PUT /time-entries/:id/approve - Approve time entry
  approve: (id) => {
    return axiosClient.put(`/time-entries/${id}/approve`);
  },

  // PUT /time-entries/:id/reject - Reject time entry
  reject: (id, reason) => {
    return axiosClient.put(`/time-entries/${id}/reject`, { reason });
  },

  // GET /time-entries/pending-approval - Get pending approvals
  getPendingApproval: (params = {}) => {
    return axiosClient.get('/time-entries/pending-approval', { params });
  },

  // Fallback: Calculate weekly summary from entries if API fails
  calculateWeeklySummary: async (entries = []) => {
    try {
      // Calculate weekly summary from entries
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // Filter entries for this week
      const weekEntries = entries.filter(entry => {
        const entryDate = new Date(entry.clockIn);
        return entryDate >= weekStart && entryDate <= weekEnd;
      });
      
      // Calculate summary
      const totalMinutes = weekEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
      const billableMinutes = weekEntries
        .filter(e => e.isBillable)
        .reduce((sum, entry) => sum + (entry.duration || 0), 0);
      
      const totalHours = totalMinutes / 60;
      const billableHours = billableMinutes / 60;
      
      // Group by day
      const byDay = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        
        const dayEntries = weekEntries.filter(entry => {
          const entryDate = new Date(entry.clockIn);
          return entryDate.toDateString() === day.toDateString();
        });
        
        const dayMinutes = dayEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
        const dayBillableMinutes = dayEntries.filter(e => e.isBillable).reduce((sum, e) => sum + (e.duration || 0), 0);
        
        byDay.push({
          date: day.toISOString().split('T')[0],
          hours: dayMinutes / 60,
          billableHours: dayBillableMinutes / 60,
        });
      }
      
      // Group by project
      const projectMap = {};
      weekEntries.forEach(entry => {
        const projectName = entry.project?.name || 'No Project';
        if (!projectMap[projectName]) {
          projectMap[projectName] = 0;
        }
        projectMap[projectName] += entry.duration || 0;
      });
      
      const byProject = Object.entries(projectMap).map(([project, minutes]) => ({
        project,
        hours: minutes / 60,
      }));
      
      return {
        data: {
          totalHours,
          billableHours,
          byDay,
          byProject,
        },
      };
    } catch (error) {
      console.error('Failed to calculate weekly summary:', error);
      return {
        data: {
          totalHours: 0,
          billableHours: 0,
          byDay: [],
          byProject: [],
        },
      };
    }
  },
};

export default timeEntriesAPI;