/* ======================================================
   src/axiosClient/timeEntriesAPI.js
   Time Entries API Client
====================================================== */
import axiosClient from "../../lib/axiosClient";

export const timeEntriesAPI = {
  /**
   * Get all time entries for a workspace
   */
  getAll: (params = {}) => {
    console.log('[API] Getting time entries', params);
    return axiosClient.get('/time-entries', { params });
  },

  /**
   * Start a new timer
   */
  start: (data) => {
    console.log('[API] Starting timer - INPUT:', data);
    
    // Extract task ID if task is an object
    const taskId = typeof data.task === 'string' 
      ? data.task 
      : data.task?._id || data.task;
    
    const payload = {
      task: taskId,
      workspace: data.workspace,
      description: data.description,
    };
    
    console.log('[API] Payload prepared:');
    console.log('  - task:', taskId, typeof taskId);
    console.log('  - workspace:', data.workspace, typeof data.workspace);
    console.log('  - description:', data.description, typeof data.description);
    console.log('[API] Full payload:', JSON.stringify(payload, null, 2));
    
    return axiosClient.post('/time-entries/start', payload);
  },

  /**
   * Stop a running timer
   */
  stop: (timerId) => {
    console.log('[API] Stopping timer', timerId);
    return axiosClient.post(`/time-entries/${timerId}/stop`);
  },

  /**
   * Create manual time entry
   */
  createManual: (data) => {
    console.log('[API] Creating manual entry', data);
    return axiosClient.post('/time-entries', {
      task: data.task,
      workspace: data.workspace,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      description: data.description,
      isBillable: data.isBillable,
      hourlyRate: data.hourlyRate,
    });
  },

  /**
   * Update time entry
   */
  update: (id, data) => {
    console.log('[API] Updating entry', id, data);
    return axiosClient.patch(`/time-entries/${id}`, data);
  },

  /**
   * Delete time entry
   */
  delete: (id) => {
    console.log('[API] Deleting entry', id);
    return axiosClient.delete(`/time-entries/${id}`);
  },

  /**
   * Get entries for date range
   */
  getByDateRange: (startDate, endDate, params = {}) => {
    console.log('[API] Getting entries by date range', { startDate, endDate });
    return axiosClient.get('/time-entries/range', {
      params: { startDate, endDate, ...params },
    });
  },

  /**
   * Get time statistics
   */
  getStats: (params = {}) => {
    console.log('[API] Getting stats', params);
    return axiosClient.get('/time-entries/stats', { params });
  },
};