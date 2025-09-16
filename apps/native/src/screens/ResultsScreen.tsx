import { observer } from "mobx-react-lite";
import { ScrollView, View } from "react-native";

import { Container } from "../components/Container";
import { Button } from "../components/ui/Button";
import { Typography } from "../components/ui/Typography";

interface ResultsScreenProps {
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  onRestart: () => void;
  onHome: () => void;
}

export const ResultsScreen = observer<ResultsScreenProps>(
  ({ score, onRestart, onHome }) => {
    const getScoreColor = (percentage: number) => {
      if (percentage >= 80) return "text-success";
      if (percentage >= 60) return "text-warning";
      return "text-danger";
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
            <Typography variant="h1" className="mb-4">
              {getScoreEmoji(score.percentage)}
            </Typography>

            <Typography variant="h3" className="mb-2">
              Quiz Complete!
            </Typography>

            <Typography
              variant="bodyLarge"
              color="tertiary"
              align="center"
              className="mb-8"
            >
              {getScoreMessage(score.percentage)}
            </Typography>
          </View>

          {/* Score Card */}
          <View className="bg-background rounded-lg p-6 mb-8 shadow-sm">
            <View className="items-center mb-6">
              <Typography
                variant="h2"
                className={`${getScoreColor(score.percentage)}`}
                testID="score-percentage"
              >
                {Math.round(score.percentage)}%
              </Typography>
              <Typography variant="bodyLarge" color="tertiary" className="mt-2">
                {score.correct} out of {score.total} correct
              </Typography>
            </View>

            {/* Progress Bar */}
            <View className="w-full bg-neutral rounded-full h-3 mb-4">
              <View
                className={`h-3 rounded-full ${
                  score.percentage >= 80
                    ? "bg-success"
                    : score.percentage >= 60
                      ? "bg-warning"
                      : "bg-danger"
                }`}
                style={{ width: `${Math.min(score.percentage, 100)}%` }}
              />
            </View>

            {/* Score Breakdown */}
            <View className="flex-row justify-between">
              <View className="items-center">
                <Typography variant="h4" color="green">
                  {score.correct}
                </Typography>
                <Typography variant="bodySmall" color="tertiary">
                  Correct
                </Typography>
              </View>

              <View className="items-center">
                <Typography variant="h4" color="red">
                  {score.total - score.correct}
                </Typography>
                <Typography variant="bodySmall" color="tertiary">
                  Incorrect
                </Typography>
              </View>

              <View className="items-center">
                <Typography variant="h4" color="blue">
                  {score.total}
                </Typography>
                <Typography variant="bodySmall" color="tertiary">
                  Total
                </Typography>
              </View>
            </View>
          </View>

          {/* Performance Tips */}
          <View className="bg-info-light rounded-lg p-6 mb-8">
            <Typography variant="h6" color="blueDarker" className="mb-3">
              Performance Tips
            </Typography>

            {score.percentage >= 80 ? (
              <View>
                <Typography color="blueDark" className="mb-2">
                  • You&apos;re doing great! Keep up the good work.
                </Typography>
                <Typography color="blueDark" className="mb-2">
                  • Consider taking longer quizzes to challenge yourself.
                </Typography>
                <Typography color="blueDark">
                  • Try different categories to expand your knowledge.
                </Typography>
              </View>
            ) : (
              <View>
                <Typography color="blueDark" className="mb-2">
                  • Review the questions you got wrong.
                </Typography>
                <Typography color="blueDark" className="mb-2">
                  • Focus on the topics where you struggled.
                </Typography>
                <Typography color="blueDark" className="mb-2">
                  • Take shorter quizzes to build confidence.
                </Typography>
                <Typography color="blueDark">
                  • Practice regularly to improve your knowledge.
                </Typography>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="space-y-4">
            <Button
              variant="primary"
              size="xl"
              onPress={onRestart}
              testID="take-another-quiz-button"
            >
              Take Another Quiz
            </Button>

            <Button
              variant="secondary"
              size="xl"
              onPress={onHome}
              testID="back-to-home-button"
            >
              Back to Home
            </Button>
          </View>
        </ScrollView>
      </Container>
    );
  },
);
