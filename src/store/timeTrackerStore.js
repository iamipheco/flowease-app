import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTimeTrackerStore = create(
  persist(
    (set, get) => ({
      // Active timer
      activeTimer: null,
      isRunning: false,
      startTime: null,
      pausedTime: 0,
      elapsedSeconds: 0,

      // Timer data
      selectedProject: null,
      selectedTask: null,
      description: '',
      isBillable: true,

      // Start timer
      startTimer: (project, task, description, isBillable) => {
        const now = Date.now();
        set({
          activeTimer: {
            project,
            task,
            description,
            isBillable,
            startTime: new Date().toISOString(),
          },
          isRunning: true,
          startTime: now,
          pausedTime: 0,
          elapsedSeconds: 0,
          selectedProject: project,
          selectedTask: task,
          description,
          isBillable,
        });
      },

      // Pause timer
      pauseTimer: () => {
        const { elapsedSeconds } = get();
        set({
          isRunning: false,
          pausedTime: elapsedSeconds,
          startTime: null,
        });
      },

      // Resume timer
      resumeTimer: () => {
        const now = Date.now();
        set({
          isRunning: true,
          startTime: now,
        });
      },

      // Stop timer
      stopTimer: () => {
        const { elapsedSeconds, activeTimer } = get();
        const finalEntry = {
          ...activeTimer,
          duration: elapsedSeconds,
          endTime: new Date().toISOString(),
        };

        set({
          activeTimer: null,
          isRunning: false,
          startTime: null,
          pausedTime: 0,
          elapsedSeconds: 0,
          selectedProject: null,
          selectedTask: null,
          description: '',
          isBillable: true,
        });

        return finalEntry;
      },

      // Update elapsed time
      tick: () => {
        const { isRunning, startTime, pausedTime } = get();
        if (isRunning && startTime) {
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000) + pausedTime;
          set({ elapsedSeconds: elapsed });
        }
      },

      // Reset timer
      resetTimer: () => {
        set({
          activeTimer: null,
          isRunning: false,
          startTime: null,
          pausedTime: 0,
          elapsedSeconds: 0,
          selectedProject: null,
          selectedTask: null,
          description: '',
          isBillable: true,
        });
      },
    }),
    {
      name: 'time-tracker-storage',
      partialize: (state) => ({
        activeTimer: state.activeTimer,
        pausedTime: state.pausedTime,
        elapsedSeconds: state.elapsedSeconds,
        selectedProject: state.selectedProject,
        selectedTask: state.selectedTask,
        description: state.description,
        isBillable: state.isBillable,
      }),
    }
  )
);