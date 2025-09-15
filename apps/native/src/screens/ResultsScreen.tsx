import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Container } from "../components/Container";

interface ResultsScreenProps {
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  onRestart: () => void;
  onHome: () => void;
}

export const ResultsScreen = ({
  score,
  onRestart,
  onHome,
}: ResultsScreenProps) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90)
      return "Excellent! You have excellent knowledge of road rules.";
    if (percentage >= 80)
      return "Great job! You have good knowledge of road rules.";
    if (percentage >= 70)
      return "Good work! You have a solid understanding of road rules.";
    if (percentage >= 60) return "Not bad! Consider reviewing some topics.";
    return "Keep studying! Review the road code to improve your knowledge.";
  };

  const getScoreEmoji = (percentage: number) => {
    if (percentage >= 90) return "🎉";
    if (percentage >= 80) return "👍";
    if (percentage >= 70) return "👌";
    if (percentage >= 60) return "📚";
    return "💪";
  };

  return (
    <Container>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <Text className="text-6xl mb-4">
            {getScoreEmoji(score.percentage)}
          </Text>

          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </Text>

          <Text className="text-lg text-gray-600 text-center mb-8">
            {getScoreMessage(score.percentage)}
          </Text>
        </View>

        {/* Score Card */}
        <View className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <View className="items-center mb-6">
            <Text
              className={`text-5xl font-bold ${getScoreColor(score.percentage)}`}
            >
              {Math.round(score.percentage)}%
            </Text>
            <Text className="text-lg text-gray-600 mt-2">
              {score.correct} out of {score.total} correct
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <View
              className={`h-3 rounded-full ${
                score.percentage >= 80
                  ? "bg-green-500"
                  : score.percentage >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${Math.min(score.percentage, 100)}%` }}
            />
          </View>

          {/* Score Breakdown */}
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {score.correct}
              </Text>
              <Text className="text-sm text-gray-600">Correct</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-red-600">
                {score.total - score.correct}
              </Text>
              <Text className="text-sm text-gray-600">Incorrect</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {score.total}
              </Text>
              <Text className="text-sm text-gray-600">Total</Text>
            </View>
          </View>
        </View>

        {/* Performance Tips */}
        <View className="bg-blue-50 rounded-lg p-6 mb-8">
          <Text className="text-lg font-semibold text-blue-800 mb-3">
            Performance Tips
          </Text>

          {score.percentage >= 80 ? (
            <View>
              <Text className="text-blue-700 mb-2">
                • You&apos;re doing great! Keep up the good work.
              </Text>
              <Text className="text-blue-700 mb-2">
                • Consider taking longer quizzes to challenge yourself.
              </Text>
              <Text className="text-blue-700">
                • Try different categories to expand your knowledge.
              </Text>
            </View>
          ) : (
            <View>
              <Text className="text-blue-700 mb-2">
                • Review the questions you got wrong.
              </Text>
              <Text className="text-blue-700 mb-2">
                • Focus on the topics where you struggled.
              </Text>
              <Text className="text-blue-700 mb-2">
                • Take shorter quizzes to build confidence.
              </Text>
              <Text className="text-blue-700">
                • Practice regularly to improve your knowledge.
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg"
            onPress={onRestart}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Take Another Quiz
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-200 p-4 rounded-lg"
            onPress={onHome}
          >
            <Text className="text-gray-700 text-lg font-semibold text-center">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};
