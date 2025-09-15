import { observer } from "mobx-react-lite";
import { Image, ScrollView, Text, View } from "react-native";

import type { DrivingTestQuestionWithKey } from "@roadcodetests/core";

interface QuestionCardProps {
  question: DrivingTestQuestionWithKey<any>;
  showExplanation?: boolean;
}

export const QuestionCard = observer(
  ({ question, showExplanation = false }: QuestionCardProps) => {
    return (
      <ScrollView className="flex-1 gap-6" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-lg p-6 shadow-sm border">
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
          <Text className="text-lg font-semibold text-gray-800 mb-4 leading-6">
            {question.question}
          </Text>

          {/* Category and Subcategory */}
          <View className="flex-row mb-4">
            <View className="bg-blue-100 px-3 py-1 rounded-full mr-2">
              <Text className="text-xs font-medium text-blue-700 capitalize">
                {question.category}
              </Text>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-xs font-medium text-gray-600 capitalize">
                {question.subcategory.replace(/-/g, " ")}
              </Text>
            </View>
          </View>

          {/* Explanation */}
          {showExplanation && question.explanation && (
            <View className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Text className="text-sm font-medium text-yellow-800 mb-2">
                Explanation:
              </Text>
              <Text className="text-sm text-yellow-700 leading-5">
                {question.explanation.text}
              </Text>
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
  },
);
