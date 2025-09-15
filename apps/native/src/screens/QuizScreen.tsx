import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { Category, Subcategory } from "@roadcodetests/core";
import { Container } from "../components/Container";
import { OptionButton } from "../components/quiz/OptionButton";
import { ProgressBar } from "../components/quiz/ProgressBar";
import { QuestionCard } from "../components/quiz/QuestionCard";
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

export const QuizScreen = observer(
  ({
    category,
    subcategory,
    quizLength,
    onComplete,
    onBack,
  }: QuizScreenProps) => {
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
            <Text className="text-lg text-gray-600 mt-4">
              Loading questions...
            </Text>
          </View>
        </Container>
      );
    }

    if (!quizStore.currentQuestion) {
      return (
        <Container>
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600 mb-4">
              No questions available
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg"
              onPress={onBack}
            >
              <Text className="text-white font-semibold">Go Back</Text>
            </TouchableOpacity>
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
            <TouchableOpacity
              className="bg-gray-200 px-4 py-2 rounded-lg"
              onPress={onBack}
            >
              <Text className="text-gray-700 font-medium">Back</Text>
            </TouchableOpacity>

            <View className="flex-row items-center">
              <Text className="text-sm text-gray-600 mr-2">
                {category} • {subcategory.replace(/-/g, " ")}
              </Text>
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
            <TouchableOpacity
              className={`px-6 py-3 rounded-lg ${
                quizStore.currentQuestionIndex > 0
                  ? "bg-gray-200"
                  : "bg-gray-100"
              }`}
              onPress={handlePrevious}
              disabled={quizStore.currentQuestionIndex === 0}
            >
              <Text
                className={`font-medium ${
                  quizStore.currentQuestionIndex > 0
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                Previous
              </Text>
            </TouchableOpacity>

            {showAnswer && (
              <TouchableOpacity
                className="bg-blue-500 px-6 py-3 rounded-lg"
                onPress={handleNext}
              >
                <Text className="text-white font-semibold">
                  {quizStore.isLastQuestion ? "Finish Quiz" : "Next Question"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Container>
    );
  },
);
