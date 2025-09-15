import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import type { Category, Subcategory } from "@roadcodetests/core";
import { useCategories, useSubcategories } from "~/hooks/useQuizQueries";
import { Container } from "../components/Container";

interface HomeScreenProps {
  onStartQuiz: (
    category: Category,
    subcategory: Subcategory<Category>,
    quizLength: number,
  ) => void;
}

// Helper function to get category display info
const getCategoryInfo = (category: Category) => {
  const categoryMap: Record<Category, { label: string; description: string }> =
    {
      car: { label: "Car", description: "Standard car license questions" },
      motorbike: {
        label: "Motorbike",
        description: "Motorcycle license questions",
      },
      heavy_vehicle: {
        label: "Heavy Vehicle",
        description: "Truck and heavy vehicle questions",
      },
    };
  return (
    categoryMap[category] || {
      label: category,
      description: `${category} questions`,
    }
  );
};

const QUIZ_LENGTHS = [5, 10, 15, 20, 30];

export const HomeScreen = ({ onStartQuiz }: HomeScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("car");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory<Category>>("core");
  const [selectedQuizLength, setSelectedQuizLength] = useState(10);

  // Fetch categories from API
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError,
  } = useCategories();

  // Fetch subcategories for selected category
  const {
    data: subcategories = [],
    isLoading: loadingSubcategories,
    error: subcategoriesError,
  } = useSubcategories(selectedCategory);

  // Update selected category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Update selected subcategory when subcategories change
  useEffect(() => {
    if (
      subcategories.length > 0 &&
      !subcategories.includes(selectedSubcategory)
    ) {
      setSelectedSubcategory(subcategories[0]);
    }
  }, [subcategories, selectedSubcategory]);

  // Handle errors
  useEffect(() => {
    if (categoriesError) {
      Alert.alert("Error", "Failed to load categories. Please try again.");
    }
  }, [categoriesError]);

  useEffect(() => {
    if (subcategoriesError) {
      Alert.alert("Error", "Failed to load subcategories. Please try again.");
    }
  }, [subcategoriesError]);

  const handleStartQuiz = () => {
    onStartQuiz(selectedCategory, selectedSubcategory, selectedQuizLength);
  };

  const getSubcategoryLabel = (subcategory: Subcategory<Category>) => {
    return subcategory
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Container>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Road Code Quiz
          </Text>
          <Text className="text-lg text-gray-600">
            Test your knowledge of New Zealand road rules
          </Text>
        </View>

        {/* Category Selection */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Select Category
          </Text>
          {loadingCategories ? (
            <View className="p-4 bg-gray-100 rounded-lg">
              <Text className="text-gray-600 text-center">
                Loading categories...
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {categories.map((category) => {
                const categoryInfo = getCategoryInfo(category);
                return (
                  <TouchableOpacity
                    key={category}
                    className={`p-4 rounded-lg border-2 ${
                      selectedCategory === category
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      className={`text-lg font-medium ${
                        selectedCategory === category
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {categoryInfo.label}
                    </Text>
                    <Text
                      className={`text-sm mt-1 ${
                        selectedCategory === category
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {categoryInfo.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Subcategory Selection */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Select Topic
          </Text>
          {loadingSubcategories ? (
            <View className="p-4 bg-gray-100 rounded-lg">
              <Text className="text-gray-600 text-center">
                Loading topics...
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3">
                {subcategories.map((subcategory) => (
                  <TouchableOpacity
                    key={subcategory}
                    className={`px-4 py-2 rounded-full border ${
                      selectedSubcategory === subcategory
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 bg-white"
                    }`}
                    onPress={() => setSelectedSubcategory(subcategory)}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedSubcategory === subcategory
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {getSubcategoryLabel(subcategory)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Quiz Length Selection */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Quiz Length
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {QUIZ_LENGTHS.map((length) => (
              <TouchableOpacity
                key={length}
                className={`px-4 py-2 rounded-lg border ${
                  selectedQuizLength === length
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 bg-white"
                }`}
                onPress={() => setSelectedQuizLength(length)}
              >
                <Text
                  className={`font-medium ${
                    selectedQuizLength === length
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {length} questions
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Quiz Button */}
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mb-8"
          onPress={handleStartQuiz}
          disabled={loadingCategories || loadingSubcategories}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Start Quiz
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};
