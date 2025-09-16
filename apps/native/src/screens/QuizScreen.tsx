import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import type { Category, Subcategory } from "@roadcodetests/core";
import { Container } from "../components/Container";
import { OptionButton } from "../components/quiz/OptionButton";
import { QuestionCard } from "../components/quiz/QuestionCard";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Typography } from "../components/ui/Typography";
import { useQuizStore } from "../contexts/QuizStoreContext";
import { useQuizData } from "../hooks/useQuizQueries";

interface QuizScreenProps {
  category: Category;
  subcategory: Subcategory<Category>;
  quizLength: number;
  onComplete: (score: {
    correct: number;
    total: number;
    percentage: number;
  }) => void;
  onBack: () => void;
}

export const QuizScreen = observer<QuizScreenProps>(
  ({ category, subcategory, quizLength, onComplete, onBack }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const quizStore = useQuizStore();

    const {
      data: questions,
      isLoading,
      error,
      refetch,
    } = useQuizData(
      category,
      subcategory,
      quizLength,
      quizStore.status === "loading",
    );

    useEffect(() => {
      if (questions && questions.length > 0) {
        quizStore.setQuestions(questions);
      }
    }, [questions, quizStore]);

    useEffect(() => {
      if (error) {
        Alert.alert("Error", "Failed to load questions. Please try again.", [
          { text: "Retry", onPress: () => refetch() },
          { text: "Go Back", onPress: onBack },
        ]);
      }
    }, [error, refetch, onBack]);

    const handleOptionSelect = (optionId: string) => {
      if (showAnswer) return;

      setSelectedOption(optionId);
      setShowAnswer(true);
      quizStore.selectAnswer(optionId);
    };

    const handleNext = () => {
      if (quizStore.isLastQuestion) {
        quizStore.completeQuiz();
        onComplete(quizStore.score);
      } else {
        quizStore.nextQuestion();
        setSelectedOption(null);
        setShowAnswer(false);
      }
    };

    const handlePrevious = () => {
      if (quizStore.currentQuestionIndex > 0) {
        quizStore.previousQuestion();
        setSelectedOption(null);
        setShowAnswer(false);
      }
    };

    if (isLoading) {
      return (
        <Container>
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Typography variant="bodyLarge" color="tertiary" className="mt-4">
              Loading questions...
            </Typography>
          </View>
        </Container>
      );
    }

    if (!quizStore.currentQuestion) {
      return (
        <Container>
          <View className="flex-1 justify-center items-center">
            <Typography variant="bodyLarge" color="tertiary" className="mb-4">
              No questions available
            </Typography>
            <Button variant="primary" size="lg" onPress={onBack}>
              Go Back
            </Button>
          </View>
        </Container>
      );
    }

    const currentQuestion = quizStore.currentQuestion;
    const isCorrect = selectedOption
      ? quizStore.checkAnswer(selectedOption)
      : false;

    return (
      <Container>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Button variant="secondary" size="md" onPress={onBack}>
              Back
            </Button>

            <View className="flex-row items-center">
              <Typography variant="bodySmall" color="tertiary" className="mr-2">
                {category} • {subcategory.replace(/-/g, " ")}
              </Typography>
            </View>
          </View>

          {/* Progress Bar */}
          <ProgressBar
            current={quizStore.progress.current}
            total={quizStore.progress.total}
            percentage={quizStore.progress.percentage}
          />

          {/* Question Card */}
          <View className="flex-1 mb-6">
            <QuestionCard question={currentQuestion} />
          </View>

          {/* Options */}
          <View className="mb-6">
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option.id}
                option={option}
                isSelected={selectedOption === option.id}
                isCorrect={
                  showAnswer && isCorrect && selectedOption === option.id
                }
                isIncorrect={
                  showAnswer && !isCorrect && selectedOption === option.id
                }
                onPress={() => handleOptionSelect(option.id)}
                disabled={showAnswer}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View className="flex-row justify-between">
            <Button
              variant="secondary"
              size="lg"
              onPress={handlePrevious}
              disabled={quizStore.currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {showAnswer && (
              <Button variant="primary" size="lg" onPress={handleNext}>
                {quizStore.isLastQuestion ? "Finish Quiz" : "Next Question"}
              </Button>
            )}
          </View>
        </View>
      </Container>
    );
  },
);
