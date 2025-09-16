import {
  types,
  type Instance,
  type SnapshotIn,
  type SnapshotOut,
} from "mobx-state-tree";

import type {
  Category,
  DrivingTestQuestionWithKey,
  Subcategory,
} from "@roadcodetests/core";

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

// User Preferences model for persistence
const UserPreferencesModel = types.model("UserPreferences", {
  lastSelectedCategory: types.optional(types.string, "car"),
  lastSelectedSubcategory: types.optional(types.string, "core"),
  lastSelectedQuizLength: types.optional(types.number, 10),
  preferredTimeLimit: types.maybeNull(types.number),
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

    // User preferences for persistence
    userPreferences: types.optional(UserPreferencesModel, {}),

    // Current answer selection state
    currentAnswerSelection: types.maybeNull(types.string),
    showAnswer: types.optional(types.boolean, false),

    // Navigation state
    navigationHistory: types.array(types.number),

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

    // Computed stats - no more manual updates needed
    get stats() {
      const totalQuestions = self.questions.length;
      const correctAnswers = self.userAnswers.filter(
        (answer) => answer.isCorrect,
      ).length;
      const incorrectAnswers = self.userAnswers.filter(
        (answer) => !answer.isCorrect,
      ).length;
      const totalTimeSpent = self.userAnswers.reduce(
        (sum, answer) => sum + answer.timeSpent,
        0,
      );
      const averageTimePerQuestion =
        self.userAnswers.length > 0
          ? totalTimeSpent / self.userAnswers.length
          : 0;

      return {
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        totalTimeSpent,
        averageTimePerQuestion,
      };
    },

    get score() {
      const stats = this.stats;
      return {
        correct: stats.correctAnswers,
        total: stats.totalQuestions,
        percentage:
          stats.totalQuestions > 0
            ? (stats.correctAnswers / stats.totalQuestions) * 100
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

    // New computed views
    get hasAnsweredCurrentQuestion() {
      return self.currentAnswerSelection !== null;
    },

    get canGoBack() {
      return self.navigationHistory.length > 0;
    },

    get currentConfig() {
      return {
        category: self.config.category,
        subcategory: self.config.subcategory,
        quizLength: self.config.quizLength,
        timeLimit: self.config.timeLimit,
      };
    },

    get isCurrentAnswerCorrect(): boolean {
      if (!self.currentAnswerSelection || !this.currentQuestion) return false;
      const currentQuestion = this.currentQuestion;
      const correctAnswer = currentQuestion.answer;
      if (Array.isArray(correctAnswer)) {
        return correctAnswer.includes(self.currentAnswerSelection);
      }
      return correctAnswer === self.currentAnswerSelection;
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

    // Enhanced configuration management
    setSelectedCategory(category: Category) {
      self.config.category = category;
      // Auto-reset subcategory when category changes
      self.config.subcategory = "core";
      // Update user preferences
      self.userPreferences.lastSelectedCategory = category;
    },

    setSelectedSubcategory(subcategory: Subcategory<Category>) {
      self.config.subcategory = subcategory;
      self.userPreferences.lastSelectedSubcategory = subcategory;
    },

    setQuizLength(length: number) {
      self.config.quizLength = length;
      self.userPreferences.lastSelectedQuizLength = length;
    },

    setTimeLimit(timeLimit: number | null) {
      self.config.timeLimit = timeLimit;
      self.userPreferences.preferredTimeLimit = timeLimit;
    },

    // Load user preferences into config
    loadUserPreferences() {
      self.config.category = self.userPreferences
        .lastSelectedCategory as Category;
      self.config.subcategory = self.userPreferences
        .lastSelectedSubcategory as Subcategory<Category>;
      self.config.quizLength = self.userPreferences.lastSelectedQuizLength;
      self.config.timeLimit = self.userPreferences.preferredTimeLimit;
    },

    // Quiz lifecycle actions
    startQuiz() {
      self.status = "loading";
      self.currentQuestionIndex = 0;
      self.userAnswers.clear();
      self.navigationHistory.clear();
      self.currentAnswerSelection = null;
      self.showAnswer = false;
      self.questionStartTime = Date.now();
      self.quizStartTime = Date.now();
      self.error = null;
    },

    setQuestions(questions: DrivingTestQuestionWithKey<Category>[]) {
      self.questions.replace(questions);
      self.status = "active";
    },

    // Enhanced navigation actions
    nextQuestion() {
      if (self.currentQuestionIndex < self.questions.length - 1) {
        self.navigationHistory.push(self.currentQuestionIndex);
        self.currentQuestionIndex += 1;
        self.questionStartTime = Date.now();
        this.clearCurrentAnswer();
      }
    },

    previousQuestion() {
      if (self.currentQuestionIndex > 0) {
        self.navigationHistory.push(self.currentQuestionIndex);
        self.currentQuestionIndex -= 1;
        self.questionStartTime = Date.now();
        this.clearCurrentAnswer();
      }
    },

    goToQuestion(index: number) {
      if (index >= 0 && index < self.questions.length) {
        self.navigationHistory.push(self.currentQuestionIndex);
        self.currentQuestionIndex = index;
        self.questionStartTime = Date.now();
        this.clearCurrentAnswer();
      }
    },

    goBack() {
      if (self.navigationHistory.length > 0) {
        const previousIndex = self.navigationHistory.pop();
        if (previousIndex !== undefined) {
          self.currentQuestionIndex = previousIndex;
          self.questionStartTime = Date.now();
          this.clearCurrentAnswer();
        }
      }
    },

    // Enhanced answer handling
    selectCurrentAnswer(optionId: string) {
      if (self.status !== "active" || !self.currentQuestion) return;

      self.currentAnswerSelection = optionId;
      self.showAnswer = true;
    },

    clearCurrentAnswer() {
      self.currentAnswerSelection = null;
      self.showAnswer = false;
    },

    // Submit answer and move to next question
    submitAnswer() {
      if (
        !self.currentAnswerSelection ||
        !self.currentQuestion ||
        self.status !== "active"
      )
        return;

      const timeSpent = self.questionStartTime
        ? Date.now() - self.questionStartTime
        : 0;

      const isCorrect = this.checkAnswer(self.currentAnswerSelection);

      const userAnswer = {
        questionId: self.currentQuestion.key,
        selectedOption: self.currentAnswerSelection,
        isCorrect,
        timeSpent,
      };

      self.userAnswers.push(userAnswer);

      // Clear current answer state
      this.clearCurrentAnswer();
    },

    // Legacy method for backward compatibility
    selectAnswer(selectedOption: string) {
      this.selectCurrentAnswer(selectedOption);
      this.submitAnswer();
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

    // Simplified reset quiz - stats are now computed
    resetQuiz() {
      self.status = "idle";
      self.currentQuestionIndex = 0;
      self.questions.clear();
      self.userAnswers.clear();
      self.navigationHistory.clear();
      self.currentAnswerSelection = null;
      self.showAnswer = false;
      self.error = null;
      self.questionStartTime = null;
      self.quizStartTime = null;
    },
  }));

// Type exports
export type QuizStore = Instance<typeof QuizStoreModel>;
export type QuizStoreSnapshotIn = SnapshotIn<typeof QuizStoreModel>;
export type QuizStoreSnapshotOut = SnapshotOut<typeof QuizStoreModel>;
export type UserAnswer = Instance<typeof UserAnswerModel>;
export type QuizConfig = Instance<typeof QuizConfigModel>;
export type UserPreferences = Instance<typeof UserPreferencesModel>;
