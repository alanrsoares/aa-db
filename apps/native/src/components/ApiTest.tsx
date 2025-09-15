import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { quizApiService } from "../services/QuizApiService";

export const ApiTest = () => {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    setLoading((prev) => ({ ...prev, [name]: true }));
    try {
      const result = await testFn();
      setResults((prev) => ({
        ...prev,
        [name]: { success: true, data: result },
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [name]: { success: false, error: error.message },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const runAllTests = async () => {
    await testEndpoint("categories", () => quizApiService.getCategories());
    await testEndpoint("subcategories", () =>
      quizApiService.getSubcategories(),
    );
    await testEndpoint("subcategories-car", () =>
      quizApiService.getSubcategories("car"),
    );
    await testEndpoint("questions", () =>
      quizApiService.getRandomQuestions(5, "car", "core"),
    );
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">API Test</Text>

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded mb-4"
        onPress={runAllTests}
      >
        <Text className="text-white text-center">Run All Tests</Text>
      </TouchableOpacity>

      {Object.entries(results).map(([name, result]) => (
        <View key={name} className="mb-3 p-3 border rounded">
          <Text className="font-semibold">{name}:</Text>
          {loading[name] ? (
            <Text className="text-blue-600">Loading...</Text>
          ) : result.success ? (
            <Text className="text-green-600">
              Success: {JSON.stringify(result.data, null, 2)}
            </Text>
          ) : (
            <Text className="text-red-600">Error: {result.error}</Text>
          )}
        </View>
      ))}
    </View>
  );
};
