import chalk from "chalk";
import puppeteer, { Browser, Page } from "puppeteer";

import Cache, { Question } from "~/Cache";
import { Category, ENDPOINT_HOST, Subcategory } from "~/constants";

import { DrivingTestQuestion, DrivingTestsQuestionsConfig } from "./types";
import { clearLine, delay, toDBQuestion } from "./utils";

const SELECTORS = {
  QUESTION_WRAPPER: "#quiz .question-wrapper",
  QUESTION_TEXT: ".question-text",
  OPTIONS: "ul#questions > li",
  LETTER: ".letter",
  TEXT: ".text span:last-child",
} as const;

export default class DrivingTestsQuestions<T extends Category> {
  cache: Cache;
  maximumEmptyAttempts: number;
  headless: boolean;
  timeout: number;
  maxAttempts: number;
  waitTime: number;
  emptyAttempts: number;
  category: T;
  subcategory: Subcategory<T>;
  quizLength: number;

  #browser: Browser | null = null;
  #page: Page | null = null;
  #fullUrl: string;

  constructor({
    cache,
    category,
    subcategory,
    maximumEmptyAttempts = 25,
    headless = false,
    timeout = 10_000,
    maxAttempts = 20,
    waitTime = 1_000,
    quizLength = 35,
  }: DrivingTestsQuestionsConfig<T>) {
    if (!(cache instanceof Cache)) {
      throw new Error("Invalid argument 'cache'");
    }
    this.cache = cache;
    this.maximumEmptyAttempts = maximumEmptyAttempts;
    this.headless = headless;
    this.timeout = timeout;
    this.maxAttempts = maxAttempts;
    this.waitTime = waitTime;
    this.emptyAttempts = 0;
    this.category = category;
    this.subcategory = subcategory;
    this.quizLength = quizLength;
    this.#fullUrl = `${ENDPOINT_HOST}/${category}/${subcategory}/${quizLength}/`;
  }

  async initialize(): Promise<void> {
    const launchOptions = {
      headless: this.headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    };

    this.#browser = await puppeteer.launch(launchOptions);
    this.#page = await this.#browser.newPage();

    // Set user agent
    await this.#page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Set viewport
    await this.#page.setViewport({ width: 1280, height: 720 });

    // Set extra headers
    await this.#page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    });
  }

  async close(): Promise<void> {
    if (this.#browser) {
      await this.#browser.close();
      this.#browser = null;
      this.#page = null;
    }
  }

  private async waitForQuestionToLoad(): Promise<void> {
    if (!this.#page) return;

    // Wait for initial load
    await delay(this.waitTime);

    // Check if questions are loaded
    let questionsLoaded = false;
    let attempts = 0;

    while (!questionsLoaded && attempts < this.maxAttempts) {
      const hasQuestionWrapper = await this.#page.evaluate(() =>
        Boolean(document.querySelector(SELECTORS.QUESTION_WRAPPER))
      );

      if (hasQuestionWrapper) {
        questionsLoaded = true;
        // Wait a bit more to ensure all questions are fully loaded
      } else {
        attempts++;
      }

      await delay(this.waitTime);
    }

    if (!questionsLoaded) {
      throw new Error("No questions found after maximum attempts");
    }
  }

  private async extractQuestion(): Promise<DrivingTestQuestion | null> {
    if (!this.#page) return null;

    return await this.#page.evaluate(() => {
      const wrapper = document.querySelector(SELECTORS.QUESTION_WRAPPER);
      if (!wrapper) {
        return null;
      }

      const textElement = wrapper.querySelector(SELECTORS.QUESTION_TEXT);
      const imgElement = wrapper.querySelector("img");
      const optionsList = wrapper.querySelectorAll(SELECTORS.OPTIONS);

      if (!textElement || !optionsList.length) {
        return null;
      }

      const options: { letter: string; text: string; id: string }[] = [];

      optionsList.forEach((option, optIndex) => {
        const letterElement = option.querySelector(SELECTORS.LETTER);
        const textElement = option.querySelector(SELECTORS.TEXT);
        const inputElement = option.querySelector("input");

        if (letterElement && textElement) {
          const letter = letterElement.textContent?.trim() || "";
          const text = textElement.textContent?.trim() || "";
          const id = inputElement?.id || `option_${optIndex}`;

          options.push({ letter, text, id });
        }
      });

      return {
        options,
        question: textElement.textContent?.trim() || "",
        imageUrl: imgElement?.src,
      };
    });
  }

  private async getCorrectAnswer(
    question: DrivingTestQuestion
  ): Promise<{ correctAnswer: string | string[]; explanation: string }> {
    if (!this.#page) {
      throw new Error("Page not initialized");
    }

    // Try the first option (any option will reveal the correct answer)
    const option = question.options[0];

    try {
      // Try clicking on the label instead of the input
      const labelSelector = `label[for="${option.id}"]`;

      // Wait for label to appear
      await this.#page.waitForSelector(labelSelector, { timeout: 5_000 });
      await this.#page.click(labelSelector);

      // Wait for submit button to appear
      await this.#page.waitForSelector("#quiz .button", { timeout: 5_000 });
      await this.#page.click("#quiz .button");

      // Wait for result to appear
      await this.#page.waitForSelector("#questionresult", { timeout: 5_000 });

      // Extract the result information
      const result = await this.#page.evaluate(() => {
        const resultElement = document.querySelector("#questionresult");
        if (!resultElement) return null;

        const isCorrect = resultElement.querySelector(".correct") !== null;
        const resultBold =
          resultElement.querySelector(".result-bold")?.textContent?.trim() ||
          "";
        const resultNormal =
          resultElement.querySelector(".result-normal")?.textContent?.trim() ||
          "";

        return {
          isCorrect,
          resultBold,
          resultNormal,
        };
      });

      if (result) {
        let correctAnswer: string | string[] = "";

        if (result.isCorrect) {
          // If we got it right, extract from "You selected X"
          const correctAnswerMatch =
            result.resultBold.match(/You selected ([A-Z])/);
          correctAnswer = correctAnswerMatch
            ? correctAnswerMatch[1]
            : option.letter.replace(".", "");
        } else {
          // If we got it wrong, extract from "the correct answer was X"
          const correctAnswerMatch = result.resultBold.match(
            /the correct answer was (([A-Z],?)+)/
          );

          if (correctAnswerMatch) {
            const split = correctAnswerMatch[1].split(",");
            correctAnswer =
              split.length > 1
                ? split.map((letter) => letter.trim())
                : split[0].trim();
          }
        }

        return {
          correctAnswer,
          explanation: result.resultNormal,
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log(
        `Error getting answer for question: ${question.question.substring(
          0,
          50
        )}... - ${errorMessage}`
      );
    }

    // If we get here, we couldn't determine the correct answer
    return {
      correctAnswer: "",
      explanation: "Could not determine correct answer",
    };
  }

  async fetchQuestion(): Promise<Question> {
    if (!this.#page) {
      throw new Error("Scraper not initialized. Call initialize() first.");
    }

    try {
      const { category, subcategory, quizLength } = this;

      console.log(
        `\n🔗 Scraping from: ${category}/${subcategory} (${quizLength} questions)`
      );

      await this.#page.goto(this.#fullUrl, {
        waitUntil: "domcontentloaded",
        timeout: this.timeout,
      });

      // Wait for the quiz container to be present
      await this.#page.waitForSelector("#quiz", {
        timeout: this.timeout,
      });

      // Wait for question to load and stabilize
      await this.waitForQuestionToLoad();

      // Extract question from the page
      const question = await this.extractQuestion();

      if (!question) {
        throw new Error("No question found");
      }

      const { correctAnswer, explanation } = await this.getCorrectAnswer(
        question
      );

      return {
        ...toDBQuestion(question, { category, subcategory }),
        answer: correctAnswer,
        explanation,
      };
    } catch (error) {
      console.error("Error during scraping:", error);
      throw error;
    }
  }

  store = (question: Question) => {
    const isCached = Boolean(this.cache.get(question.key));

    clearLine();

    if (isCached) {
      this.emptyAttempts++;
    } else {
      this.emptyAttempts = 0;
      this.cache.set(question.key, question);
    }

    const { category, subcategory } = this;

    process.stdout.write(
      `New ${category}/${subcategory} questions cached: ${chalk.bold.green(
        isCached ? 1 : 0
      )}. Total: ${chalk.bold.cyan(this.cache.length)}.`
    );

    if (this.emptyAttempts) {
      clearLine();

      process.stdout.write(
        `Empty attempt: ${chalk.bold.red(
          `${this.emptyAttempts}/${this.maximumEmptyAttempts}`
        )}.`
      );
    }
  };

  async sync(): Promise<Question[]> {
    if (!this.#browser) {
      await this.initialize();
    }

    try {
      while (this.emptyAttempts !== this.maximumEmptyAttempts) {
        try {
          await this.fetchQuestion().then(this.store);
          await delay(1_000);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(chalk.bold.red(error.message));
            // Continue trying instead of breaking on error
            this.emptyAttempts++;
            await delay(1_000);
          } else {
            console.log(chalk.bold.red("Unknown error occurred"));
            this.emptyAttempts++;
            await delay(1_000);
          }
        }
      }

      clearLine();

      const { category, subcategory } = this;

      console.log(
        `Operation cancelled after ${chalk.bold.red(
          this.maximumEmptyAttempts
        )} empty attempts.`,
        `Total ${category}/${subcategory}: ${chalk.bold.cyan(
          this.cache.length
        )}.`
      );

      return this.cache.collection.value().map((q) => q.value);
    } finally {
      await this.close();
    }
  }
}
