import type { FC } from "react";
import { Image, ScrollView, View } from "react-native";
import { cva } from "styled-cva";

import type { DrivingTestQuestionWithKey } from "@roadcodetests/core";
import { Typography } from "../ui/Typography";

interface QuestionCardProps {
  question: DrivingTestQuestionWithKey<any>;
  showExplanation?: boolean;
  testID?: string;
}

// Style variants using cva - only for styles that have variants
const categoryChipVariants = cva(`px-3 py-1 rounded-full mr-2`, {
  variants: {
    type: {
      category: "bg-info-light",
      subcategory: "bg-background-secondary",
    },
  },
  defaultVariants: {
    type: "category",
  },
});

const explanationVariants = cva(`mt-4 p-4 rounded-lg border`, {
  variants: {
    visible: {
      true: "bg-warning-light border-warning",
      false: "hidden",
    },
  },
  defaultVariants: {
    visible: true,
  },
});

export const QuestionCard: FC<QuestionCardProps> = ({
  question,
  showExplanation = false,
  testID,
}) => {
  return (
    <ScrollView
      className="flex-1 gap-6"
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      <View className="bg-background rounded-lg p-6 shadow-sm border">
        {/* Question Image */}
        {question.imageUrl && (
          <View className="mb-4">
            <Image
              source={{ uri: question.imageUrl }}
              className="w-full h-48 rounded-lg"
              resizeMode="contain"
            />
          </View>
        )}

        {/* Question Text */}
        <Typography
          variant="h6"
          className="mb-4"
          leading="relaxed"
          testID="question-text"
        >
          {question.question}
        </Typography>

        {/* Category and Subcategory */}
        <View className="flex-row mb-4">
          <View className={categoryChipVariants({ type: "category" })}>
            <Typography
              variant="caption"
              color="blueDark"
              transform="capitalize"
            >
              {question.category}
            </Typography>
          </View>
          <View className={categoryChipVariants({ type: "subcategory" })}>
            <Typography
              variant="caption"
              color="tertiary"
              transform="capitalize"
            >
              {question.subcategory.replace(/-/g, " ")}
            </Typography>
          </View>
        </View>

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <View className={explanationVariants({ visible: true })}>
            <Typography
              variant="bodySmall"
              weight="medium"
              color="yellowDark"
              className="mb-2"
            >
              Explanation:
            </Typography>
            <Typography variant="bodySmall" color="yellow" leading="normal">
              {question.explanation.text}
            </Typography>
            {question.explanation.imageUrl && (
              <Image
                source={{ uri: question.explanation.imageUrl }}
                className="w-full h-32 rounded mt-2"
                resizeMode="cover"
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
