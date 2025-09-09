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

const StatusKindModel = types.union(
  types.literal("initializing"),
  types.literal("ready"),
  types.literal("error"),
  types.literal("finished"),
  types.literal("loading"),
);

export type StatusKind = Instance<typeof StatusKindModel>;

// Console UI state model - only essential data for rendering
export const DrivingTestStateModel = types
  .model("DrivingTestState", {
    // UI state for console rendering
    statusText: types.string,
    status: StatusKindModel,
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
    setStatus(kind: StatusKind, text: string) {
      self.statusText = text;
      self.status = kind;
      return self;
    },
    setLastError(error: string | null) {
      self.lastError = error;
      return self;
    },
    setCurrentUrl(url: string) {
      self.currentUrl = url;
      return self;
    },
    setProgress(current: number, total: number) {
      self.progress.current = current;
      self.progress.total = total;
      self.progress.percentage = (current / total) * 100;
      return self;
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
      return self;
    },
    reset() {
      self.status = "initializing";
      self.statusText = "Initializing...";
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
    get hasErrors() {
      return self.status === "error" || self.lastError !== null;
    },
    get isComplete() {
      return self.status === "finished" || !this.hasErrors;
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
