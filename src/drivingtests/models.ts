import {
  types,
  type Instance,
  type SnapshotIn,
  type SnapshotOut,
} from "mobx-state-tree";

// Progress model for console UI
const ProgressModel = types.model("Progress", {
  current: types.number,
  total: types.number,
  percentage: types.number,
});

// Statistics model for console UI
const StatsModel = types.model("Stats", {
  newQuestions: types.number,
  totalQuestions: types.number,
  questionsByCategory: types.number,
  emptyAttempts: types.number,
  maxEmptyAttempts: types.number,
});

// Console UI state model - only essential data for rendering
export const DrivingTestStateModel = types
  .model("DrivingTestState", {
    // UI state for console rendering
    status: types.string,
    isLoading: types.boolean,
    isError: types.boolean,
    isFinished: types.boolean,
    progress: types.optional(ProgressModel, {
      current: 0,
      total: 0,
      percentage: 0,
    }),
    stats: types.optional(StatsModel, {
      newQuestions: 0,
      totalQuestions: 0,
      questionsByCategory: 0,
      emptyAttempts: 0,
      maxEmptyAttempts: 0,
    }),
    lastError: types.maybeNull(types.string),
    currentUrl: types.string,
  })
  .actions((self) => ({
    setStatus(status: string) {
      self.status = status;
    },

    setLoading(loading: boolean) {
      self.isLoading = loading;
    },

    setError(error: boolean) {
      self.isError = error;
    },

    setFinished(finished: boolean) {
      self.isFinished = finished;
    },

    setLastError(error: string | null) {
      self.lastError = error;
    },

    setCurrentUrl(url: string) {
      self.currentUrl = url;
    },

    setProgress(current: number, total: number, percentage: number) {
      self.progress.current = current;
      self.progress.total = total;
      self.progress.percentage = percentage;
    },

    updateStats(
      updates: Partial<{
        newQuestions: number;
        totalQuestions: number;
        questionsByCategory: number;
        emptyAttempts: number;
        maxEmptyAttempts: number;
      }>,
    ) {
      Object.assign(self.stats, updates);
    },

    reset() {
      self.isLoading = false;
      self.isError = false;
      self.isFinished = false;
      self.status = "Initializing...";
      self.progress.current = 0;
      self.progress.total = 0;
      self.progress.percentage = 0;
      self.stats.newQuestions = 0;
      self.stats.totalQuestions = 0;
      self.stats.questionsByCategory = 0;
      self.stats.emptyAttempts = 0;
      self.stats.maxEmptyAttempts = 0;
      self.lastError = null;
      self.currentUrl = "";
    },
  }))
  .views((self) => ({
    get progressPercentage() {
      if (self.progress.total === 0) return 0;
      return (self.progress.current / self.progress.total) * 100;
    },

    get isComplete() {
      return self.isFinished && !self.isError;
    },

    get hasErrors() {
      return self.isError || self.lastError !== null;
    },
  }));

// Type exports
export type DrivingTestState = Instance<typeof DrivingTestStateModel>;
export type DrivingTestStateSnapshotIn = SnapshotIn<
  typeof DrivingTestStateModel
>;
export type DrivingTestStateSnapshotOut = SnapshotOut<
  typeof DrivingTestStateModel
>;
