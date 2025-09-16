import { expect, test } from "@playwright/test";

test.describe("Quiz Flow E2E Tests", () => {
  test("should load home screen correctly", async ({ page }) => {
    // Navigate to the app
    await page.goto("/");

    // Wait for the home screen to load
    await expect(page.getByTestId("start-quiz-button")).toBeVisible();

    // Verify category selection is available
    await expect(page.getByTestId("category-car")).toBeVisible();

    // Verify subcategory selection is available
    await expect(page.getByTestId("subcategory-core")).toBeVisible();

    // Verify quiz length selection is available
    await expect(page.getByTestId("quiz-length-10")).toBeVisible();
  });
  test("should complete a full quiz flow", async ({ page }) => {
    // Navigate to the app
    await page.goto("/");

    // Wait for the home screen to load
    await expect(page.getByTestId("start-quiz-button")).toBeVisible();

    // Select a category (Car)
    await page.getByTestId("category-car").click();

    // Select a subcategory (Core)
    await page.getByTestId("subcategory-core").click();

    // Select quiz length (10 questions)
    await page.getByTestId("quiz-length-10").click();

    // Start the quiz
    await page.getByTestId("start-quiz-button").click();

    // Wait for quiz screen to load
    await expect(page.getByTestId("question-text")).toBeVisible();

    // Answer questions (select option A for each question)
    for (let i = 0; i < 10; i++) {
      // Wait for question to load
      await expect(page.getByTestId("question-text")).toBeVisible();

      // Select option A
      await page.getByTestId("option-a").click();

      // Wait for answer to be revealed and navigation button to appear
      if (i < 9) {
        // Wait for next button to appear after selecting answer
        await expect(page.getByTestId("next-button")).toBeVisible();
        await page.getByTestId("next-button").click();
      } else {
        // Wait for finish button to appear on last question
        await expect(page.getByTestId("finish-quiz-button")).toBeVisible();
        await page.getByTestId("finish-quiz-button").click();
      }
    }

    // Wait for results screen
    await expect(page.getByTestId("score-percentage")).toBeVisible();

    // Verify score is displayed
    const scoreElement = page.getByTestId("score-percentage");
    await expect(scoreElement).toBeVisible();

    // Take another quiz
    await page.getByTestId("take-another-quiz-button").click();

    // Should be back to quiz screen
    await expect(page.getByTestId("question-text")).toBeVisible();
  });

  test("should navigate back from quiz to home", async ({ page }) => {
    // Navigate to the app
    await page.goto("/");

    // Start a quiz
    await page.getByTestId("category-car").click();
    await page.getByTestId("subcategory-core").click();
    await page.getByTestId("quiz-length-10").click();
    await page.getByTestId("start-quiz-button").click();

    // Wait for quiz screen
    await expect(page.getByTestId("question-text")).toBeVisible();

    // Go back to home
    await page.getByTestId("quiz-back-button").click();

    // Should be back on home screen
    await expect(page.getByTestId("start-quiz-button")).toBeVisible();
  });

  test("should navigate from results back to home", async ({ page }) => {
    // Navigate to the app
    await page.goto("/");

    // Complete a quick quiz with minimum questions (1 question)
    await page.getByTestId("category-car").click();
    await page.getByTestId("subcategory-core").click();
    await page.getByTestId("quiz-length-10").click();
    await page.getByTestId("start-quiz-button").click();

    // Answer all 10 questions to reach the finish button
    for (let i = 0; i < 10; i++) {
      // Wait for question to load
      await expect(page.getByTestId("question-text")).toBeVisible();

      // Select option A
      await page.getByTestId("option-a").click();

      // Wait for answer to be revealed and navigation button to appear
      if (i < 9) {
        // Wait for next button to appear after selecting answer
        await expect(page.getByTestId("next-button")).toBeVisible();
        await page.getByTestId("next-button").click();
      } else {
        // Wait for finish button to appear on last question
        await expect(page.getByTestId("finish-quiz-button")).toBeVisible();
        await page.getByTestId("finish-quiz-button").click();
      }
    }

    // Wait for results
    await expect(page.getByTestId("score-percentage")).toBeVisible();

    // Go back to home
    await page.getByTestId("back-to-home-button").click();

    // Should be back on home screen
    await expect(page.getByTestId("start-quiz-button")).toBeVisible();
  });

  test("should complete a short quiz flow", async ({ page }) => {
    // Navigate to the app
    await page.goto("/");

    // Wait for the home screen to load
    await expect(page.getByTestId("start-quiz-button")).toBeVisible();

    // Select a category (Car)
    await page.getByTestId("category-car").click();

    // Select a subcategory (Core)
    await page.getByTestId("subcategory-core").click();

    // Select quiz length (10 questions - minimum available)
    await page.getByTestId("quiz-length-10").click();
    await page.getByTestId("start-quiz-button").click();

    // Wait for quiz screen to load
    await expect(page.getByTestId("question-text")).toBeVisible();

    // Answer all 10 questions quickly
    for (let i = 0; i < 10; i++) {
      // Wait for question to load
      await expect(page.getByTestId("question-text")).toBeVisible();

      // Select option A
      await page.getByTestId("option-a").click();

      // Wait for answer to be revealed and navigation button to appear
      if (i < 9) {
        // Wait for next button to appear after selecting answer
        await expect(page.getByTestId("next-button")).toBeVisible();
        await page.getByTestId("next-button").click();
      } else {
        // Wait for finish button to appear on last question
        await expect(page.getByTestId("finish-quiz-button")).toBeVisible();
        await page.getByTestId("finish-quiz-button").click();
      }
    }

    // Wait for results screen
    await expect(page.getByTestId("score-percentage")).toBeVisible();

    // Verify score is displayed
    const scoreElement = page.getByTestId("score-percentage");
    await expect(scoreElement).toBeVisible();
  });
});
