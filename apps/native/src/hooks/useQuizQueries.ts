import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Category, Subcategory } from "@roadcodetests/core";
import { quizApiService } from "../services/QuizApiService";

// Query Keys
export const quizKeys = {
  all: ["quiz"] as const,
  categories: () => [...quizKeys.all, "categories"] as const,
  subcategories: (category?: Category) =>
    [...quizKeys.all, "subcategories", category] as const,
  questions: (
    category: Category,
    subcategory: Subcategory<Category>,
    limit: number,
  ) => [...quizKeys.all, "questions", category, subcategory, limit] as const,
  question: (id: string) => [...quizKeys.all, "question", id] as const,
};

// Hooks
export function useCategories() {
  return useQuery({
    queryKey: quizKeys.categories(),
    queryFn: () => quizApiService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
}

export function useSubcategories(category?: Category) {
  return useQuery({
    queryKey: quizKeys.subcategories(category),
    queryFn: () => quizApiService.getSubcategories(category),
    enabled: !!category,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useRandomQuestions(
  category: Category,
  subcategory: Subcategory<Category>,
  limit: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: quizKeys.questions(category, subcategory, limit),
    queryFn: () =>
      quizApiService.getRandomQuestions(limit, category, subcategory),
    enabled: enabled && !!category && !!subcategory && limit > 0,
    staleTime: 0, // Always fetch fresh questions for quiz
    gcTime: 0, // Don't cache quiz questions
  });
}

export function useQuestionById(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: quizKeys.question(id),
    queryFn: () => quizApiService.getQuestionById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation for prefetching questions
export function usePrefetchQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      category,
      subcategory,
      limit,
    }: {
      category: Category;
      subcategory: Subcategory<Category>;
      limit: number;
    }) => {
      return queryClient.prefetchQuery({
        queryKey: quizKeys.questions(category, subcategory, limit),
        queryFn: () =>
          quizApiService.getRandomQuestions(limit, category, subcategory),
        staleTime: 0,
      });
    },
  });
}

// Hook to handle quiz data fetching with QuizStore integration
export function useQuizData(
  category: Category,
  subcategory: Subcategory<Category>,
  quizLength: number,
  enabled: boolean = true,
) {
  const query = useRandomQuestions(category, subcategory, quizLength, enabled);

  return {
    ...query,
    // Additional helper methods can be added here if needed
    isReady: !query.isLoading && !query.error && !!query.data,
  };
}
