import chalk from "chalk";
import puppeteer, { Browser, Page } from "puppeteer";

import Cache, { CacheKey } from "~/Cache";
import {
  ENDPOINT_HOST,
  EXTRA_HEADERS,
  MAX_ATTEMPTS,
  MAX_EMPTY_ATTEMPTS,
  PUPPETEER_ARGS,
  TIMEOUT,
  USER_AGENT,
  VIEWPORT,
  WAIT_TIME,
  type Category,
  type Subcategory,
} from "~/config";
import type {
  Answer,
  DrivingTestsQuestionsConfig,
  Explanation,
  Option,
  Question,
  DrivingTestQuestionWithKey as QuestionWithKey,
} from "./types";
import { clearLine, delay, makeKey } from "./utils";

export default class DrivingTestsQuestions<T extends Category> {
  #cache: Cache<Question>;
  #browser: Browser | null = null;
  #page: Page | null = null;
  #fullUrl: string;

  maximumEmptyAttempts: number;
  headless: boolean;
  timeout: number;
  maxAttempts: number;
  waitTime: number;
  emptyAttempts: number;
  category: T;
  subcategory: Subcategory<T>;

  constructor({
    cache,
    category,
    subcategory,
    maximumEmptyAttempts = MAX_EMPTY_ATTEMPTS,
    headless = false,
    timeout = TIMEOUT,
    maxAttempts = MAX_ATTEMPTS,
    waitTime = WAIT_TIME,
    quizLength = 1,
  }: DrivingTestsQuestionsConfig<T>) {
    if (!(cache instanceof Cache)) {
      throw new Error("Invalid argument 'cache'");
    }
    this.#cache = cache;
    this.maximumEmptyAttempts = maximumEmptyAttempts;
    this.headless = headless;
    this.timeout = timeout;
    this.maxAttempts = maxAttempts;
    this.waitTime = waitTime;
    this.emptyAttempts = 0;
    this.category = category;
    this.subcategory = subcategory;
    this.#fullUrl = `${ENDPOINT_HOST}/${category}/${subcategory}/${quizLength}/`;
  }

  async #initialize(): Promise<void> {
    this.#browser = await puppeteer.launch({
      headless: this.headless,
      args: PUPPETEER_ARGS,
    });
    this.#page = await this.#browser.newPage();

    await this.#page.setUserAgent(USER_AGENT);
    await this.#page.setViewport(VIEWPORT);
    await this.#page.setExtraHTTPHeaders(EXTRA_HEADERS);
  }

  async #close(): Promise<void> {
    if (this.#browser) {
      await this.#browser.close();
      this.#browser = null;
      this.#page = null;
    }
  }

  async #waitForQuestionToLoad(): Promise<void> {
    if (!this.#page) return;

    let questionsLoaded = false;
    let attempts = 0;

    while (!questionsLoaded && attempts < this.maxAttempts) {
      const wrapper = await this.#page.evaluate(() =>
        document.querySelector("#quiz .question-wrapper"),
      );

      if (wrapper) {
        questionsLoaded = true;
      } else {
        attempts++;
      }

      // progressively increase wait time to ensure all questions are fully loaded
      await delay(this.waitTime + attempts * 10);
    }

    if (!questionsLoaded) {
      throw new Error("No questions found after maximum attempts");
    }
  }

  async #extractQuestion(): Promise<Question | null> {
    if (!this.#page) return null;

    return await this.#page.evaluate(() => {
      const wrapper = document.querySelector("#quiz .question-wrapper");
      if (!wrapper) {
        return null;
      }

      const textElement = wrapper.querySelector(".question-text");
      const imgElement = wrapper.querySelector("img");
      const optionsList = wrapper.querySelectorAll("ul#questions > li");

      if (!textElement || !optionsList?.length) {
        return null;
      }

      const options: Option[] = [];

      optionsList.forEach((option, optIndex) => {
        const $letter = option.querySelector<HTMLSpanElement>(".letter");
        const $text = option.querySelector<HTMLSpanElement>(
          ".text span:last-child",
        );
        const $input = option.querySelector<HTMLInputElement>("input");
        const $img = option.querySelector<HTMLImageElement>("img");

        if ($letter && $text) {
          options.push({
            letter: $letter.textContent?.trim().replace(".", "") || "",
            text: $text.textContent?.trim() || "",
            id: $input?.id || `option_${optIndex}`,
            imageUrl: $img?.src || "",
          });
        }
      });

      return {
        options,
        question: textElement.textContent?.trim() || "",
        imageUrl: imgElement?.src || "",
      } satisfies Question;
    });
  }

  async #inferAnswer(question: Question): Promise<Answer> {
    if (!this.#page) {
      throw new Error("Page not initialized");
    }

    // Try the first option (any option will reveal the correct answer)
    const [option] = question.options;

    try {
      // Try clicking on the label instead of the input
      const labelSelector = `label[for="${option?.id}"]`;

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
        const $result = document.querySelector("#questionresult");
        if (!$result) return null;

        const isCorrect = $result.querySelector(".correct") !== null;
        const resultBold =
          $result.querySelector(".result-bold")?.textContent?.trim() || "";
        const resultNormal =
          $result.querySelector(".result-normal")?.textContent?.trim() || "";

        const imageUrl = $result.querySelector("img")?.src || "";

        return {
          isCorrect,
          resultBold,
          resultNormal,
          imageUrl,
        };
      });

      if (result) {
        let answer: string | string[] = "";

        if (result.isCorrect) {
          // If we got it right, extract from "You selected X"
          const correctAnswerMatch =
            result.resultBold.match(/You selected ([A-Z])/);
          answer = correctAnswerMatch
            ? correctAnswerMatch[1] || ""
            : option?.letter || "";
        } else {
          // If we got it wrong, extract from "the correct answer was X"
          const correctAnswerMatch = result.resultBold.match(
            /the correct answer was (([A-Z],?)+)/,
          );

          if (correctAnswerMatch) {
            const split = correctAnswerMatch[1]?.split(",") || [];
            answer =
              split.length > 1
                ? split.map((letter) => letter.trim())
                : split[0]?.trim() || "";
          }
        }

        return {
          answer,
          explanation: {
            text: result.resultNormal,
            imageUrl: result.imageUrl,
          } as Explanation,
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log(
        `Error inferring answer for question: ${question.question.substring(
          0,
          50,
        )}... - ${errorMessage}`,
      );
    }

    return {
      answer: "",
      explanation: {
        text: "Could not determine answer",
      } as Explanation,
    };
  }

  async #fetchQuestion(): Promise<QuestionWithKey<T>> {
    if (!this.#page) {
      throw new Error("Scraper not initialized. Call initialize() first.");
    }

    try {
      console.log(`\n🔗 Scraping from: ${this.category}/${this.subcategory}`);

      await this.#page.goto(this.#fullUrl, {
        waitUntil: "domcontentloaded",
        timeout: this.timeout,
      });

      // Wait for the quiz container to be present
      await this.#page.waitForSelector("#quiz", {
        timeout: this.timeout,
      });

      // Wait for question to load and stabilize
      await this.#waitForQuestionToLoad();

      // Extract question from the page
      const question = await this.#extractQuestion();

      if (!question) {
        throw new Error("No question found");
      }

      const { answer, explanation } = await this.#inferAnswer(question);

      return {
        ...question,
        answer,
        explanation,
        key: makeKey(question),
        category: this.category,
        subcategory: this.subcategory,
      };
    } catch (error) {
      console.error("Error during scraping:", error);
      throw error;
    }
  }

  #store = (question: QuestionWithKey<T>) => {
    const isCached = Boolean(this.#cache.get(question.key));

    clearLine();

    if (isCached) {
      this.emptyAttempts++;
    } else {
      this.emptyAttempts = 0;
      this.#cache.set(question.key, question);
    }

    process.stdout.write(
      `New ${this.category}/${this.subcategory} questions cached: ${chalk.bold.green(
        isCached ? 0 : 1,
      )}. Total: ${chalk.bold.cyan(this.#cache.length)}.`,
    );

    if (this.emptyAttempts) {
      clearLine();

      process.stdout.write(
        `Empty attempt: ${chalk.bold.red(
          `${this.emptyAttempts}/${this.maximumEmptyAttempts}`,
        )}.`,
      );
    }
  };

  async sync(): Promise<Question[]> {
    if (!this.#browser) {
      await this.#initialize();
    }

    try {
      while (this.emptyAttempts !== this.maximumEmptyAttempts) {
        try {
          await this.#fetchQuestion().then(this.#store);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(chalk.bold.red(error.message));
            // Continue trying instead of breaking on error
            this.emptyAttempts++;
          } else {
            console.log(chalk.bold.red("Unknown error occurred"));
            this.emptyAttempts++;
          }
        }
      }

      clearLine();

      console.log(
        `Operation cancelled after ${chalk.bold.red(
          this.maximumEmptyAttempts,
        )} empty attempts.`,
        `Total ${this.category}/${this.subcategory}: ${chalk.bold.cyan(
          this.#cache.length,
        )}.`,
      );

      return this.#cache.collection.map((q) => q.value);
    } finally {
      await this.#close();
    }
  }
}
