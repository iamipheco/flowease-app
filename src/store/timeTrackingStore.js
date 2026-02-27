/* ======================================================
   src/store/timeTrackingStore.js
   Time Tracking State Management (Zustand) - AUTO RESUME TIMER
====================================================== */
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * Time Tracking Store
 * Manages timer UI state and auto-resumes running timers
 */
export const useTimeTrackingStore = create(
  devtools(
    persist(
      (set, get) => ({
        // =============================
        // UI STATE
        // =============================
        selectedTask: null,
        description: "",
        startTime: null, // Timestamp of when timer started
        isPaused: false,
        pausedAt: null,
        pausedDuration: 0, // Total paused seconds
        elapsedSeconds: 0, // Live counter

        // Modals
        showTaskSelector: false,
        showDescriptionField: false,
        showManualEntryModal: false,
        showSwitchTaskModal: false,
        pendingTask: null,

        // =============================
        // TIMER ACTIONS
        // =============================

        /**
         * Start timer for a task
         */
        startTimer: (task, description = "") => {
          if (get().selectedTask) {
            console.warn("⏱ Timer already running for another task");
            return;
          }
          const now = new Date().toISOString();
          set({
            selectedTask: task,
            description,
            startTime: now,
            isPaused: false,
            pausedAt: null,
            pausedDuration: 0,
            elapsedSeconds: 0,
            showDescriptionField: false,
          });
        },

        /**
         * Stop timer
         */
        stopTimer: () => {
          set({
            selectedTask: null,
            description: "",
            startTime: null,
            isPaused: false,
            pausedAt: null,
            pausedDuration: 0,
            elapsedSeconds: 0,
          });
        },

        /**
         * Pause timer
         */
        pauseTimer: () => {
          const now = new Date().toISOString();
          set({ isPaused: true, pausedAt: now });
        },

        /**
         * Resume timer
         */
        resumeTimer: () => {
          const { pausedAt, pausedDuration } = get();
          if (!pausedAt) return;
          const pausedSeconds = Math.floor(
            (new Date() - new Date(pausedAt)) / 1000,
          );
          set({
            isPaused: false,
            pausedAt: null,
            pausedDuration: pausedDuration + pausedSeconds,
          });
        },

        /**
         * Reset timer state (after stopping)
         */
        resetTimer: () => {
          set({
            selectedTask: null,
            description: "",
            startTime: null,
            isPaused: false,
            pausedAt: null,
            pausedDuration: 0,
            elapsedSeconds: 0,
            showDescriptionField: false,
          });
        },

        /**
         * Increment live elapsed time every second
         * Should be called from a useEffect in Timer UI
         */
        tick: () => {
          const { startTime, isPaused, pausedDuration } = get();
          if (!startTime || isPaused) return;
          const elapsed =
            Math.floor((new Date() - new Date(startTime)) / 1000) -
            pausedDuration;
          set({ elapsedSeconds: elapsed > 0 ? elapsed : 0 });
        },

        /**
         * Sync with active entry from server
         */
        syncWithActiveEntry: (activeEntry) => {
          if (!activeEntry) return;

          const { selectedTask, description } = get();

          const taskChanged = selectedTask?._id !== activeEntry.task?._id;
          const descChanged = description !== activeEntry.description;

          if (taskChanged || descChanged) {
            console.log("[STORE] Syncing active entry:", activeEntry._id);
            set({
              selectedTask: activeEntry.task || null,
              description: activeEntry.description || "",
              showDescriptionField: false, // hide while timer running
            });
          }
        },

        // =============================
        // MODAL ACTIONS
        // =============================
        selectTask: (task) =>
          set({
            selectedTask: task,
            showTaskSelector: false,
            showDescriptionField: true,
            description: "",
          }),
        setDescription: (description) => set({ description }),
        clearTask: () =>
          set({
            selectedTask: null,
            description: "",
            showDescriptionField: false,
          }),
        toggleTaskSelector: () =>
          set((state) => ({ showTaskSelector: !state.showTaskSelector })),
        closeTaskSelector: () => set({ showTaskSelector: false }),
        openManualEntry: () => set({ showManualEntryModal: true }),
        closeManualEntry: () => set({ showManualEntryModal: false }),
        initiateTaskSwitch: (newTask) =>
          set({ pendingTask: newTask, showSwitchTaskModal: true }),
        cancelTaskSwitch: () =>
          set({ pendingTask: null, showSwitchTaskModal: false }),
        confirmTaskSwitch: () => {
          const { pendingTask } = get();
          set({
            selectedTask: pendingTask,
            pendingTask: null,
            showSwitchTaskModal: false,
            description: "",
            showDescriptionField: true,
          });
        },
      }),
      {
        name: "flowease-time-tracking",
        partialize: (state) => ({
          selectedTask: state.selectedTask,
          description: state.description,
          startTime: state.startTime,
          elapsedSeconds: state.elapsedSeconds,
        }),
      },
    ),
    { name: "TimeTrackingStore" },
  ),
);
