import { observer } from "mobx-react-lite";
import { useState } from "react";

import type { Category, Subcategory } from "@roadcodetests/core";
import { useQuizStore } from "~/contexts/QuizStoreContext";
import { HomeScreen } from "~/screens/HomeScreen";
import { QuizScreen } from "~/screens/QuizScreen";
import { ResultsScreen } from "~/screens/ResultsScreen";

type Screen = "home" | "quiz" | "results";

export const QuizRouter = observer(() => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const quizStore = useQuizStore();

  const handleStartQuiz = (
    category: Category,
    subcategory: Subcategory<Category>,
    quizLength: number,
  ) => {
    // Set quiz configuration in the store
    quizStore.setConfig({ category, subcategory, quizLength });
    // Start the quiz (this will set status to loading)
    quizStore.startQuiz();
    setCurrentScreen("quiz");
  };

  const handleQuizComplete = (_score: {
    correct: number;
    total: number;
    percentage: number;
  }) => {
    setCurrentScreen("results");
  };

  const handleBackToHome = () => {
    quizStore.resetQuiz();
    setCurrentScreen("home");
  };

  const handleRestartQuiz = () => {
    // Reset the quiz and start again with the same configuration
    quizStore.startQuiz();
    setCurrentScreen("quiz");
  };

  const handleBackFromQuiz = () => {
    quizStore.resetQuiz();
    setCurrentScreen("home");
  };

  switch (currentScreen) {
    case "home":
      return <HomeScreen onStartQuiz={handleStartQuiz} />;

    case "quiz":
      // Check if we have a valid quiz configuration
      if (!quizStore.config.category || !quizStore.config.subcategory) {
        return <HomeScreen onStartQuiz={handleStartQuiz} />;
      }
      return (
        <QuizScreen
          category={quizStore.config.category as Category}
          subcategory={quizStore.config.subcategory as Subcategory<Category>}
          quizLength={quizStore.config.quizLength}
          onComplete={handleQuizComplete}
          onBack={handleBackFromQuiz}
        />
      );

    case "results":
      // Check if quiz is completed and we have score data
      if (!quizStore.isQuizComplete) {
        return <HomeScreen onStartQuiz={handleStartQuiz} />;
      }
      return (
        <ResultsScreen
          score={quizStore.score}
          onRestart={handleRestartQuiz}
          onHome={handleBackToHome}
        />
      );

    default:
      return <HomeScreen onStartQuiz={handleStartQuiz} />;
  }
});
