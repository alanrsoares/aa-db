import type {
  Category,
  DrivingTestQuestionWithKey,
  Subcategory,
} from "@roadcodetests/core";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    type: string;
    message: string;
  };
}

export interface QuizApiService {
  getRandomQuestions(
    limit: number,
    category: Category,
    subcategory: Subcategory<Category>
  ): Promise<DrivingTestQuestionWithKey<Category>[]>;
  
  getQuestionById(id: string): Promise<DrivingTestQuestionWithKey<Category> | null>;
  
  getCategories(): Promise<Category[]>;
  
  getSubcategories(category?: Category): Promise<Subcategory<Category>[]>;
}

class QuizApiServiceImpl implements QuizApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3000") {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || "API request failed");
      }

      return result.data as T;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getRandomQuestions(
    limit: number,
    category: Category,
    subcategory: Subcategory<Category>
  ): Promise<DrivingTestQuestionWithKey<Category>[]> {
    try {
      const questions = await this.makeRequest<DrivingTestQuestionWithKey<Category>[]>(
        `/questions/${category}/${subcategory}/${limit}`
      );
      return questions;
    } catch (error) {
      console.error("Failed to fetch random questions:", error);
      throw new Error("Failed to fetch questions. Please try again.");
    }
  }

  async getQuestionById(
    id: string
  ): Promise<DrivingTestQuestionWithKey<Category> | null> {
    try {
      const question = await this.makeRequest<DrivingTestQuestionWithKey<Category>>(
        `/questions/${id}`
      );
      return question;
    } catch (error) {
      console.error("Failed to fetch question by ID:", error);
      return null;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const categories = await this.makeRequest<Category[]>("/categories");
      return categories;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw new Error("Failed to fetch categories. Please try again.");
    }
  }

  async getSubcategories(category?: Category): Promise<Subcategory<Category>[]> {
    try {
      const endpoint = category ? `/subcategories?category=${category}` : "/subcategories";
      const subcategories = await this.makeRequest<Subcategory<Category>[]>(endpoint);
      return subcategories;
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      throw new Error("Failed to fetch subcategories. Please try again.");
    }
  }
}

// Export singleton instance
export const quizApiService = new QuizApiServiceImpl();

// Export class for testing
export { QuizApiServiceImpl };
