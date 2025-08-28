import Cache from "~/Cache";

import type { Category, Subcategory } from "~/constants";

export interface Option {
  letter: string;
  text: string;
  id: string;
}

export interface DrivingTestQuestion {
  question: string;
  options: Option[];
  answer?: string | string[];
  explanation?: string;
  imageUrl?: string;
}

export interface DrivingTestsQuestionsConfig<T extends Category> {
  cache: Cache;
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
