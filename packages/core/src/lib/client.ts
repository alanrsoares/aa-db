import { join } from "path";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { Either, Just, Left, Maybe, Nothing, Right } from "purify-ts";

import type { Category, Subcategory } from "../config";
import type { DrivingTestQuestionWithKey } from "../types";
import { Cache, CacheKey, type Database as CacheDatabase } from "./cache";

type DB = CacheDatabase<DrivingTestQuestionWithKey<Category>>;

// Error types for better error handling
export type ClientError =
  | { type: "FILE_NOT_FOUND"; message: string }
  | { type: "INVALID_JSON"; message: string }
  | { type: "QUESTION_NOT_FOUND"; message: string }
  | { type: "INVALID_FILTER"; message: string }
  | { type: "CACHE_ERROR"; message: string };

// Client class with functional programming patterns
export class QuestionsClient {
  private readonly dbPath: string;
  private cache: Maybe<Cache<DrivingTestQuestionWithKey<Category>>> = Nothing;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || join(process.cwd(), "data", "db", "db.json");
  }

  // Initialize cache with error handling
  private initializeCache(): Either<
    ClientError,
    Cache<DrivingTestQuestionWithKey<Category>>
  > {
    try {
      const adapter = new JSONFileSync<DB>(this.dbPath);
      const db = new LowSync<DB>(adapter, { cache: [] });
      const cache = new Cache<DrivingTestQuestionWithKey<Category>>({ db });
      this.cache = Just(cache);
      return Right(cache);
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
    return this.getCache().map(
      (cache: Cache<DrivingTestQuestionWithKey<Category>>) => {
        // Get all questions from the cache collection
        return cache.collection.map(
          (item: CacheKey<DrivingTestQuestionWithKey<Category>>) => item.value,
        );
      },
    );
  }

  // Get a random question
  public getRandomQuestion(): Either<
    ClientError,
    DrivingTestQuestionWithKey<Category>
  > {
    return this.getAllQuestions().chain(
      (questions: DrivingTestQuestionWithKey<Category>[]) => {
        if (questions.length === 0) {
          return Left({
            type: "QUESTION_NOT_FOUND",
            message: "No questions found in database",
          });
        }

        const randomIndex = Math.floor(Math.random() * questions.length);
        const question = questions[randomIndex];
        return question
          ? Right(question)
          : Left({
              type: "QUESTION_NOT_FOUND",
              message: "Failed to get random question",
            });
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

  // Get questions by category
  public getQuestionsByCategory(
    category: Category,
  ): Either<ClientError, DrivingTestQuestionWithKey<Category>[]> {
    return this.getAllQuestions()
      .map((questions: DrivingTestQuestionWithKey<Category>[]) =>
        questions.filter(
          (q: DrivingTestQuestionWithKey<Category>) => q.category === category,
        ),
      )
      .chain((questions: DrivingTestQuestionWithKey<Category>[]) => {
        if (questions.length === 0) {
          return Left({
            type: "QUESTION_NOT_FOUND",
            message: `No questions found for category '${category}'`,
          });
        }
        return Right(questions);
      });
  }

  // Get questions by subcategory
  public getQuestionsBySubcategory(
    subcategory: string,
  ): Either<ClientError, DrivingTestQuestionWithKey<Category>[]> {
    return this.getAllQuestions()
      .map((questions: DrivingTestQuestionWithKey<Category>[]) =>
        questions.filter(
          (q: DrivingTestQuestionWithKey<Category>) =>
            q.subcategory === subcategory,
        ),
      )
      .chain((questions: DrivingTestQuestionWithKey<Category>[]) => {
        if (questions.length === 0) {
          return Left({
            type: "QUESTION_NOT_FOUND",
            message: `No questions found for subcategory '${subcategory}'`,
          });
        }
        return Right(questions);
      });
  }

  // Get questions by category and subcategory
  public getQuestionsByCategoryAndSubcategory(
    category: Category,
    subcategory: Subcategory<Category>,
  ): Either<ClientError, DrivingTestQuestionWithKey<Category>[]> {
    return this.getAllQuestions()
      .map((questions: DrivingTestQuestionWithKey<Category>[]) =>
        questions.filter(
          (q: DrivingTestQuestionWithKey<Category>) =>
            q.category === category && q.subcategory === subcategory,
        ),
      )
      .chain((questions: DrivingTestQuestionWithKey<Category>[]) => {
        if (questions.length === 0) {
          return Left({
            type: "QUESTION_NOT_FOUND",
            message: `No questions found for category '${category}' and subcategory '${subcategory}'`,
          });
        }
        return Right(questions);
      });
  }

  // Get a random question by category
  public getRandomQuestionByCategory(
    category: Category,
  ): Either<ClientError, DrivingTestQuestionWithKey<Category>> {
    return this.getQuestionsByCategory(category).chain(
      (questions: DrivingTestQuestionWithKey<Category>[]) => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const question = questions[randomIndex];
        return question
          ? Right(question)
          : Left({
              type: "QUESTION_NOT_FOUND",
              message: "Failed to get random question",
            });
      },
    );
  }

  // Get a random question by subcategory
  public getRandomQuestionBySubcategory(
    subcategory: string,
  ): Either<ClientError, DrivingTestQuestionWithKey<Category>> {
    return this.getQuestionsBySubcategory(subcategory).chain(
      (questions: DrivingTestQuestionWithKey<Category>[]) => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const question = questions[randomIndex];
        return question
          ? Right(question)
          : Left({
              type: "QUESTION_NOT_FOUND",
              message: "Failed to get random question",
            });
      },
    );
  }

  // Get a random question by category and subcategory
  public getRandomQuestionByCategoryAndSubcategory(
    category: Category,
    subcategory: Subcategory<Category>,
  ): Either<ClientError, DrivingTestQuestionWithKey<Category>> {
    return this.getQuestionsByCategoryAndSubcategory(
      category,
      subcategory,
    ).chain((questions: DrivingTestQuestionWithKey<Category>[]) => {
      const randomIndex = Math.floor(Math.random() * questions.length);
      const question = questions[randomIndex];
      return question
        ? Right(question)
        : Left({
            type: "QUESTION_NOT_FOUND",
            message: "Failed to get random question",
          });
    });
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

  // Get subcategories for a specific category
  public getSubcategoriesByCategory(
    category: Category,
  ): Either<ClientError, string[]> {
    return this.getQuestionsByCategory(category).map(
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

  // Get total question count
  public getQuestionCount(): Either<ClientError, number> {
    return this.getAllQuestions().map(
      (questions: DrivingTestQuestionWithKey<Category>[]) => questions.length,
    );
  }

  // Clear the cache (useful for testing or when database changes)
  public clearCache(): void {
    this.cache = Nothing;
  }

  // Add a question to the cache
  public addQuestion(
    question: DrivingTestQuestionWithKey<Category>,
  ): Either<ClientError, void> {
    return this.getCache().map(
      (cache: Cache<DrivingTestQuestionWithKey<Category>>) => {
        cache.set(question.key, question);
      },
    );
  }

  // Remove a question from the cache
  public removeQuestion(key: string): Either<ClientError, void> {
    return this.getCache().map(
      (cache: Cache<DrivingTestQuestionWithKey<Category>>) => {
        cache.invalidate(key);
      },
    );
  }
}

// Factory function to create a client instance
export const createQuestionsClient = (dbPath?: string): QuestionsClient => {
  return new QuestionsClient(dbPath);
};

// Default client instance
export const questionsClient = createQuestionsClient();
