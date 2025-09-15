import { existsSync } from "fs";
import { join, resolve } from "path";
import {
  createQuestionsClient,
  type Category,
  type ClientError,
  type Subcategory,
} from "@roadcodetests/core";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Either } from "purify-ts";

// API-specific error types
export type APIError = ClientError;

const dbPath =
  process.env.DB_PATH || resolve("..", "..", "data", "db", "db.json");

// check if dbPath exists
if (!existsSync(dbPath)) {
  console.error(`DB path ${dbPath} does not exist`);
  process.exit(1);
}

const questionsClient = createQuestionsClient(dbPath);

// Create Hono app
const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Helper function to handle Either responses using purify-ts v2+ patterns
const handleEitherResponse = <T>(
  result: Either<ClientError | APIError, T>,
  c: any,
) => {
  if (result.isLeft()) {
    const error = result.extract() as ClientError | APIError;
    return c.json(
      {
        success: false,
        error: {
          type: error.type,
          message: error.message,
        },
      },
      getErrorStatusCode(error.type) as any,
    );
  }

  const data = result.extract() as T;
  return c.json({
    success: true,
    data,
  });
};

// Helper function to get appropriate HTTP status code for error types
const getErrorStatusCode = (errorType: string): number => {
  switch (errorType) {
    case "FILE_NOT_FOUND":
    case "QUESTION_NOT_FOUND":
      return 404;
    case "INVALID_JSON":
    case "CACHE_ERROR":
      return 500;
    default:
      return 500;
  }
};

// Health check endpoint
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Road Code Tests API is running",
    version: "1.0.0",
  });
});

// Get random questions
app.get("/questions/:category/:subcategory/:limit", (c) => {
  const limit = parseInt(c.req.param("limit") || "1");
  const category = c.req.param("category") as Category | undefined;
  const subcategory = c.req.param("subcategory") as
    | Subcategory<Category>
    | undefined;

  const options = { category, subcategory };

  if (!category || !subcategory) {
    return c.json(
      {
        success: false,
        error: {
          type: "INVALID_REQUEST",
          message: "Category and subcategory are required",
        },
      },
      400,
    );
  }

  const result = questionsClient.getRandomQuestions(limit, options);

  return handleEitherResponse(result, c);
});

// Get a question by ID
app.get("/questions/:id", (c) => {
  const id = c.req.param("id");
  const result = questionsClient.getQuestionById(id);
  return handleEitherResponse(result, c);
});

// Get all available categories
app.get("/categories", (c) => {
  const result = questionsClient.getCategories();
  return handleEitherResponse(result, c);
});

// Get all available subcategories
app.get("/subcategories", (c) => {
  const result = questionsClient.getSubcategories();
  return handleEitherResponse(result, c);
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        type: "NOT_FOUND",
        message: "Endpoint not found",
      },
    },
    404,
  );
});

// Error handler
app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json(
    {
      success: false,
      error: {
        type: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    },
    500,
  );
});

// Start server
const port = process.env.PORT || 3000;
console.log(`🚀 Road Code Tests API running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
