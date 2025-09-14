import {
  questionsClient,
  type Category,
  type ClientError,
  type Subcategory,
} from "@roadcodetests/core";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Either, Left, Right } from "purify-ts";

// API-specific error types
export type APIError =
  | { type: "VALIDATION_ERROR"; message: string }
  | ClientError;

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

// Helper function to validate category parameter using purify-ts v2+
const validateCategory = (category: string): Either<APIError, Category> => {
  const validCategories: Category[] = ["car", "motorbike", "heavy_vehicle"];

  return validCategories.includes(category as Category)
    ? Right(category as Category)
    : Left({
        type: "VALIDATION_ERROR",
        message: `Invalid category. Must be one of: ${validCategories.join(", ")}`,
      });
};

// Helper function to get appropriate HTTP status code for error types
const getErrorStatusCode = (errorType: string): number => {
  switch (errorType) {
    case "FILE_NOT_FOUND":
    case "QUESTION_NOT_FOUND":
      return 404;
    case "INVALID_JSON":
    case "INVALID_FILTER":
    case "VALIDATION_ERROR":
      return 400;
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

// Get a random question
app.get("/questions/random", (c) => {
  const result = questionsClient.getRandomQuestion();
  return handleEitherResponse(result, c);
});

// Get a question by ID
app.get("/questions/:id", (c) => {
  const id = c.req.param("id");
  const result = questionsClient.getQuestionById(id);
  return handleEitherResponse(result, c);
});

// Get questions by category with validation
app.get("/questions/category/:category", (c) => {
  const categoryParam = c.req.param("category");

  const result = validateCategory(categoryParam).chain((category) => {
    return questionsClient.getQuestionsByCategory(category);
  });

  return handleEitherResponse(result, c);
});

// Get questions by subcategory
app.get("/questions/subcategory/:subcategory", (c) => {
  const subcategory = c.req.param("subcategory");
  const result = questionsClient.getQuestionsBySubcategory(subcategory);
  return handleEitherResponse(result, c);
});

// Get questions by category and subcategory
app.get("/questions/category/:category/subcategory/:subcategory", (c) => {
  const category = c.req.param("category") as Category;
  const subcategory = c.req.param("subcategory") as Subcategory<Category>;
  const result = questionsClient.getQuestionsByCategoryAndSubcategory(
    category,
    subcategory,
  );
  return handleEitherResponse(result, c);
});

// Get a random question by category with validation
app.get("/questions/random/category/:category", (c) => {
  const categoryParam = c.req.param("category");

  const result = validateCategory(categoryParam).chain((category) => {
    return questionsClient.getRandomQuestionByCategory(category);
  });

  return handleEitherResponse(result, c);
});

// Get a random question by subcategory
app.get("/questions/random/subcategory/:subcategory", (c) => {
  const subcategory = c.req.param("subcategory");
  const result = questionsClient.getRandomQuestionBySubcategory(subcategory);
  return handleEitherResponse(result, c);
});

// Get a random question by category and subcategory
app.get(
  "/questions/random/category/:category/subcategory/:subcategory",
  (c) => {
    const category = c.req.param("category") as Category;
    const subcategory = c.req.param("subcategory") as Subcategory<Category>;
    const result = questionsClient.getRandomQuestionByCategoryAndSubcategory(
      category,
      subcategory,
    );
    return handleEitherResponse(result, c);
  },
);

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

// Get subcategories for a specific category with validation
app.get("/categories/:category/subcategories", (c) => {
  const categoryParam = c.req.param("category");

  const result = validateCategory(categoryParam).chain((category) => {
    return questionsClient.getSubcategoriesByCategory(category);
  });

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
