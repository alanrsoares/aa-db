import Cache from "~/Cache";
import type { Category, Subcategory } from "~/config";

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

export type DrivingTestQuestionWithKey = Question & {
  key: string;
};

export interface DrivingTestsQuestionsConfig<T extends Category> {
  cache: Cache<Question>;
  maximumEmptyAttempts?: number;
  headless?: boolean;
  timeout?: number;
  maxAttempts?: number;
  waitTime?: number;
  category: T;
  subcategory: Subcategory<T>;
  quizLength?: number;
}

export interface EndpointInfo {
  category: string;
  subcategory: string;
}
