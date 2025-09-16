import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import type { Category, Subcategory } from "@roadcodetests/core";
import { useCategories, useSubcategories } from "~/hooks/useQuizQueries";
import { Container } from "../components/Container";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { TouchableCard } from "../components/ui/TouchableCard";
import { Typography } from "../components/ui/Typography";

interface HomeScreenProps {
  onStartQuiz: (
    category: Category,
    subcategory: Subcategory<Category>,
    quizLength: number,
  ) => void;
}

interface CategoryInfo {
  label: string;
  description: string;
}

// Helper function to get category display info
const getCategoryInfo = (category: Category): CategoryInfo => {
  const categoryMap: Record<Category, CategoryInfo> = {
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

const QUIZ_LENGTHS = [10, 15, 20, 30, 35];

export const HomeScreen = observer<HomeScreenProps>(({ onStartQuiz }) => {
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
          <Typography variant="h3" className="mb-2">
            Road Code Quiz
          </Typography>
          <Typography variant="bodyLarge" color="tertiary">
            Test your knowledge of New Zealand road rules
          </Typography>
        </View>

        {/* Category Selection */}
        <View className="mb-8">
          <Typography variant="h5" className="mb-4">
            Select Category
          </Typography>
          {loadingCategories ? (
            <View className="p-4 bg-background-secondary rounded-lg">
              <Typography color="tertiary" align="center">
                Loading categories...
              </Typography>
            </View>
          ) : (
            <View className="space-y-3">
              {categories.map((category) => {
                const { label, description } = getCategoryInfo(category);
                return (
                  <TouchableCard
                    key={category}
                    label={label}
                    description={description}
                    selected={selectedCategory === category}
                    onPress={setSelectedCategory.bind(null, category)}
                    testID={`category-${category}`}
                  />
                );
              })}
            </View>
          )}
        </View>

        {/* Subcategory Selection */}
        <View className="mb-8">
          <Typography variant="h5" className="mb-4">
            Select Topic
          </Typography>
          {loadingSubcategories ? (
            <View className="p-4 bg-background-secondary rounded-lg">
              <Typography color="tertiary" align="center">
                Loading topics...
              </Typography>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3">
                {subcategories.map((subcategory) => (
                  <Chip
                    key={subcategory}
                    label={getSubcategoryLabel(subcategory)}
                    selected={selectedSubcategory === subcategory}
                    onPress={setSelectedSubcategory.bind(null, subcategory)}
                    testID={`subcategory-${subcategory}`}
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Quiz Length Selection */}
        <View className="mb-8">
          <Typography variant="h5" className="mb-4">
            Quiz Length
          </Typography>
          <View className="flex-row flex-wrap gap-3">
            {QUIZ_LENGTHS.map((length) => (
              <Button
                key={length}
                variant={selectedQuizLength === length ? "primary" : "outline"}
                size="sm"
                onPress={() => setSelectedQuizLength(length)}
                testID={`quiz-length-${length}`}
              >
                {`${length} questions`}
              </Button>
            ))}
          </View>
        </View>

        {/* Start Quiz Button */}
        <Button
          variant="primary"
          size="xl"
          onPress={handleStartQuiz}
          disabled={loadingCategories || loadingSubcategories}
          className="mb-8"
          testID="start-quiz-button"
        >
          Start Quiz
        </Button>
      </ScrollView>
    </Container>
  );
});
