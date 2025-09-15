import { LowSync, MemorySync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { Either, Just, Left, Maybe, Nothing, Right } from "purify-ts";

import { type Category, type Subcategory } from "../config";
import type { DrivingTestQuestionWithKey } from "../types";
import { Cache, CacheKey, type Database as CacheDatabase } from "./cache";

type DB = CacheDatabase<DrivingTestQuestionWithKey<Category>>;

// Error types for better error handling
export type ClientError =
  | { type: "FILE_NOT_FOUND"; message: string }
  | { type: "INVALID_JSON"; message: string }
  | { type: "QUESTION_NOT_FOUND"; message: string }
  | { type: "CACHE_ERROR"; message: string };

// Client class with functional programming patterns
export class QuestionsClient {
  private readonly dbPath: string;
  private cache: Maybe<Cache<DrivingTestQuestionWithKey<Category>>> = Nothing;

  constructor(dbPath: string) {
    // Use a default path that works in both Node.js and web environments
    this.dbPath = dbPath;
  }

  // Initialize cache with error handling
  private initializeCache(): Either<
    ClientError,
    Cache<DrivingTestQuestionWithKey<Category>>
  > {
    try {
      // Check if we're in a Node.js environment
      if (
        typeof process !== "undefined" &&
        process.versions &&
        process.versions.node &&
        JSONFileSync
      ) {
        // Node.js environment - use file system
        const adapter = new JSONFileSync<DB>(this.dbPath);
        const db = new LowSync<DB>(adapter, { cache: [] });
        // Read existing data from file
        db.read();
        const cache = new Cache<DrivingTestQuestionWithKey<Category>>({ db });
        this.cache = Just(cache);
        return Right(cache);
      } else {
        // Web environment - use in-memory storage
        const db = new LowSync<DB>(new MemorySync<DB>(), { cache: [] });
        const cache = new Cache<DrivingTestQuestionWithKey<Category>>({ db });
        this.cache = Just(cache);
        return Right(cache);
      }
    } catch (error: any) {
      return Left({
        type: "CACHE_ERROR",
        message: `Failed to initialize cache: ${error.message}`,
      });
    }
  }

  // Get cache instance
  private getCache(): Either<
    ClientError,
    Cache<DrivingTestQuestionWithKey<Category>>
  > {
    if (this.cache.isJust()) {
      return Right(this.cache.extract());
    }

    return this.initializeCache();
  }

  // Get all questions from cache
  private getAllQuestions(): Either<
    ClientError,
    DrivingTestQuestionWithKey<Category>[]
  > {
    const cache = this.getCache();

    return cache.map((cache) => {
      // Get all questions from the cache collection
      return cache.collection.map(
        (item: CacheKey<DrivingTestQuestionWithKey<Category>>) => item.value,
      );
    });
  }

  // Get a list of random questions
  public getRandomQuestions(
    limit: number,
    options?: {
      category?: Category;
      subcategory?: Subcategory<Category>;
    },
  ): Either<ClientError, DrivingTestQuestionWithKey<Category>[]> {
    return this.getAllQuestions().chain(
      (questions: DrivingTestQuestionWithKey<Category>[]) => {
        if (questions.length === 0) {
          return Left({
            type: "QUESTION_NOT_FOUND",
            message: "No questions found in database",
          });
        }

        // Filter questions based on options if provided
        let filteredQuestions = questions;
        if (options?.category) {
          filteredQuestions = filteredQuestions.filter(
            (q) => q.category === options.category,
          );
        }
        if (options?.subcategory) {
          filteredQuestions = filteredQuestions.filter(
            (q) => q.subcategory === options.subcategory,
          );
        }

        if (filteredQuestions.length === 0) {
          return Left({
            type: "QUESTION_NOT_FOUND",
            message: `No questions found matching the specified criteria`,
          });
        }

        // Get random questions without replacement
        const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(
          0,
          Math.min(limit, filteredQuestions.length),
        );

        return Right(selectedQuestions);
      },
    );
  }

  // Get a question by key (id)
  public getQuestionById(
    id: string,
  ): Either<ClientError, DrivingTestQuestionWithKey<Category>> {
    return this.getCache().chain(
      (cache: Cache<DrivingTestQuestionWithKey<Category>>) => {
        // Try to get from cache first
        const cachedQuestion = cache.get(id);
        if (cachedQuestion) {
          return Right(cachedQuestion);
        }

        // If not in cache, search in the collection
        const question = cache.collection.find(
          (item: CacheKey<DrivingTestQuestionWithKey<Category>>) =>
            item.value.key === id,
        );
        return question
          ? Right(question.value)
          : Left({
              type: "QUESTION_NOT_FOUND",
              message: `Question with id '${id}' not found`,
            });
      },
    );
  }

  // Get all available categories
  public getCategories(): Either<ClientError, Category[]> {
    return this.getAllQuestions().map(
      (questions: DrivingTestQuestionWithKey<Category>[]) =>
        [
          ...new Set(
            questions.map(
              (q: DrivingTestQuestionWithKey<Category>) => q.category,
            ),
          ),
        ].sort(),
    );
  }

  // Get all available subcategories
  public getSubcategories(): Either<ClientError, string[]> {
    return this.getAllQuestions().map(
      (questions: DrivingTestQuestionWithKey<Category>[]) =>
        [
          ...new Set(
            questions.map(
              (q: DrivingTestQuestionWithKey<Category>) => q.subcategory,
            ),
          ),
        ].sort(),
    );
  }
}

// Factory function to create a client instance
export const createQuestionsClient = (dbPath: string): QuestionsClient => {
  return new QuestionsClient(dbPath);
};
