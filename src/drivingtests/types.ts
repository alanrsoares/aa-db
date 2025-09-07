import type { Category, Subcategory } from "~/drivingtests/config";
import Cache from "~/lib/Cache";

// DeepPartial utility type for nested partial updates
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface Option {
  letter: string;
  text: string;
  id: string;
  imageUrl?: string;
}

export interface Explanation {
  text: string;
  imageUrl?: string;
}

export interface Answer {
  answer: string | string[];
  explanation: Explanation;
}

export interface Question {
  question: string;
  options: Option[];
  answer?: string | string[];
  explanation?: Explanation;
  imageUrl?: string;
}

export type DrivingTestQuestionWithKey<T extends Category> = Question & {
  key: string;
  category: T;
  subcategory: Subcategory<T>;
};

export interface DrivingTestsQuestionsConfig<T extends Category> {
  cache: Cache<DrivingTestQuestionWithKey<T>>;
  maximumEmptyAttempts?: number;
  headless?: boolean;
  timeout?: number;
  maxAttempts?: number;
  category: T;
  subcategory: Subcategory<T>;
  waitTime?: number;
  quizLength?: number;
}
