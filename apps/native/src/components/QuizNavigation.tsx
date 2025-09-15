import { useState } from "react";

import type { Category, Subcategory } from "@roadcodetests/core";
import { HomeScreen } from "../screens/HomeScreen";
import { QuizScreen } from "../screens/QuizScreen";
import { ResultsScreen } from "../screens/ResultsScreen";

type Screen = "home" | "quiz" | "results";

interface QuizState {
  category: Category;
  subcategory: Subcategory<Category>;
  quizLength: number;
}

interface ResultsState {
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
}

const QuizNavigation = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [resultsState, setResultsState] = useState<ResultsState | null>(null);

  const handleStartQuiz = (
    category: Category,
    subcategory: Subcategory<Category>,
    quizLength: number,
  ) => {
    setQuizState({ category, subcategory, quizLength });
    setCurrentScreen("quiz");
  };

  const handleQuizComplete = (score: {
    correct: number;
    total: number;
    percentage: number;
  }) => {
    setResultsState({ score });
    setCurrentScreen("results");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setQuizState(null);
    setResultsState(null);
  };

  const handleRestartQuiz = () => {
    if (quizState) {
      setCurrentScreen("quiz");
      setResultsState(null);
    }
  };

  const handleBackFromQuiz = () => {
    setCurrentScreen("home");
    setQuizState(null);
  };

  switch (currentScreen) {
    case "home":
      return <HomeScreen onStartQuiz={handleStartQuiz} />;

    case "quiz":
      if (!quizState) {
        return <HomeScreen onStartQuiz={handleStartQuiz} />;
      }
      return (
        <QuizScreen
          category={quizState.category}
          subcategory={quizState.subcategory}
          quizLength={quizState.quizLength}
          onComplete={handleQuizComplete}
          onBack={handleBackFromQuiz}
        />
      );

    case "results":
      if (!resultsState) {
        return <HomeScreen onStartQuiz={handleStartQuiz} />;
      }
      return (
        <ResultsScreen
          score={resultsState.score}
          onRestart={handleRestartQuiz}
          onHome={handleBackToHome}
        />
      );

    default:
      return <HomeScreen onStartQuiz={handleStartQuiz} />;
  }
};

export { QuizNavigation };
