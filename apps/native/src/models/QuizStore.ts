import type {
  Category,
  DrivingTestQuestionWithKey,
  Option,
  Subcategory,
} from "@roadcodetests/core";
import {
  types,
  type Instance,
  type SnapshotIn,
  type SnapshotOut,
} from "mobx-state-tree";

// User Answer model
const UserAnswerModel = types.model("UserAnswer", {
  questionId: types.string,
  selectedOption: types.string,
  isCorrect: types.boolean,
  timeSpent: types.number, // in milliseconds
});

// Quiz Configuration model
const QuizConfigModel = types.model("QuizConfig", {
  category: types.string,
  subcategory: types.string,
  quizLength: types.number,
  timeLimit: types.maybeNull(types.number), // in seconds, null for no limit
});

// Quiz Statistics model
const QuizStatsModel = types.model("QuizStats", {
  totalQuestions: types.number,
  correctAnswers: types.number,
  incorrectAnswers: types.number,
  totalTimeSpent: types.number,
  averageTimePerQuestion: types.number,
});

// Quiz Status enum
const QuizStatusModel = types.union(
  types.literal("idle"),
  types.literal("loading"),
  types.literal("active"),
  types.literal("completed"),
  types.literal("error"),
);

export type QuizStatus = Instance<typeof QuizStatusModel>;

// Main Quiz Store
export const QuizStoreModel = types
  .model("QuizStore", {
    // Quiz state
    status: types.optional(QuizStatusModel, "idle"),
    currentQuestionIndex: types.optional(types.number, 0),
    questions: types.array(
      types.frozen<DrivingTestQuestionWithKey<Category>>(),
    ),
    userAnswers: types.array(UserAnswerModel),

    // Configuration
    config: types.optional(QuizConfigModel, {
      category: "car",
      subcategory: "core",
      quizLength: 10,
      timeLimit: null,
    }),

    // Statistics
    stats: types.optional(QuizStatsModel, {
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalTimeSpent: 0,
      averageTimePerQuestion: 0,
    }),

    // Error handling
    error: types.maybeNull(types.string),

    // Timing
    questionStartTime: types.maybeNull(types.number),
    quizStartTime: types.maybeNull(types.number),
  })
  .views((self) => ({
    get currentQuestion() {
      return self.questions[self.currentQuestionIndex] || null;
    },

    get progress() {
      return {
        current: self.currentQuestionIndex + 1,
        total: self.questions.length,
        percentage:
          self.questions.length > 0
            ? ((self.currentQuestionIndex + 1) / self.questions.length) * 100
            : 0,
      };
    },

    get score() {
      return {
        correct: self.stats.correctAnswers,
        total: self.stats.totalQuestions,
        percentage:
          self.stats.totalQuestions > 0
            ? (self.stats.correctAnswers / self.stats.totalQuestions) * 100
            : 0,
      };
    },

    get isLastQuestion() {
      return self.currentQuestionIndex === self.questions.length - 1;
    },

    get isQuizComplete() {
      return self.status === "completed";
    },

    get canProceed() {
      return (
        self.status === "active" &&
        self.questions[self.currentQuestionIndex] !== undefined
      );
    },
  }))
  .actions((self) => ({
    // Configuration actions
    setConfig(
      config: Partial<{
        category: Category;
        subcategory: Subcategory<Category>;
        quizLength: number;
        timeLimit: number | null;
      }>,
    ) {
      Object.assign(self.config, config);
    },

    // Quiz lifecycle actions
    startQuiz() {
      self.status = "loading";
      self.currentQuestionIndex = 0;
      self.userAnswers.clear();
      self.questionStartTime = Date.now();
      self.quizStartTime = Date.now();
      self.error = null;
    },

    setQuestions(questions: DrivingTestQuestionWithKey<Category>[]) {
      self.questions.replace(questions);
      self.stats.totalQuestions = questions.length;
      self.stats.correctAnswers = 0;
      self.stats.incorrectAnswers = 0;
      self.stats.totalTimeSpent = 0;
      self.status = "active";
    },

    // Question navigation
    nextQuestion() {
      if (self.currentQuestionIndex < self.questions.length - 1) {
        self.currentQuestionIndex += 1;
        self.questionStartTime = Date.now();
      }
    },

    previousQuestion() {
      if (self.currentQuestionIndex > 0) {
        self.currentQuestionIndex -= 1;
        self.questionStartTime = Date.now();
      }
    },

    // Answer handling
    selectAnswer(selectedOption: string) {
      const currentQuestion = self.questions[self.currentQuestionIndex];
      if (!currentQuestion || self.status !== "active") return;

      const timeSpent = self.questionStartTime
        ? Date.now() - self.questionStartTime
        : 0;

      const isCorrect = this.checkAnswer(selectedOption);

      const userAnswer = {
        questionId: currentQuestion.key,
        selectedOption,
        isCorrect,
        timeSpent,
      };

      self.userAnswers.push(userAnswer);

      // Update stats
      if (isCorrect) {
        self.stats.correctAnswers += 1;
      } else {
        self.stats.incorrectAnswers += 1;
      }

      self.stats.totalTimeSpent += timeSpent;
      self.stats.averageTimePerQuestion =
        self.stats.totalTimeSpent / self.userAnswers.length;
    },

    checkAnswer(selectedOption: string): boolean {
      const currentQuestion = self.questions[self.currentQuestionIndex];
      if (!currentQuestion) return false;

      const correctAnswer = currentQuestion.answer;
      if (Array.isArray(correctAnswer)) {
        return correctAnswer.includes(selectedOption);
      }
      return correctAnswer === selectedOption;
    },

    // Quiz completion
    completeQuiz() {
      self.status = "completed";
    },

    // Error handling
    setError(error: string) {
      self.error = error;
      self.status = "error";
    },

    clearError() {
      self.error = null;
    },

    // Reset quiz
    resetQuiz() {
      self.status = "idle";
      self.currentQuestionIndex = 0;
      self.questions.clear();
      self.userAnswers.clear();
      self.error = null;
      self.questionStartTime = null;
      self.quizStartTime = null;
      self.stats.totalQuestions = 0;
      self.stats.correctAnswers = 0;
      self.stats.incorrectAnswers = 0;
      self.stats.totalTimeSpent = 0;
      self.stats.averageTimePerQuestion = 0;
    },
  }));

// Type exports
export type QuizStore = Instance<typeof QuizStoreModel>;
export type QuizStoreSnapshotIn = SnapshotIn<typeof QuizStoreModel>;
export type QuizStoreSnapshotOut = SnapshotOut<typeof QuizStoreModel>;
export type UserAnswer = Instance<typeof UserAnswerModel>;
export type QuizConfig = Instance<typeof QuizConfigModel>;
export type QuizStats = Instance<typeof QuizStatsModel>;
