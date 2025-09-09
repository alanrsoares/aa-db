import puppeteer, { Browser, Page } from "puppeteer";

import {
  CATEGORIES,
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
} from "~/drivingtests/config";
import Cache from "~/lib/Cache";
import { DrivingTestStateModel, type DrivingTestState } from "./models";
import { ReactiveRenderer } from "./ReactiveRenderer";
import type {
  Answer,
  DrivingTestQuestionWithKey,
  DrivingTestsQuestionsConfig,
  Explanation,
  Option,
  Question,
} from "./types";
import { delay, makeKey } from "./utils";

// Type for state updates derived from the actual state type

export default class QuestionsCrawler<T extends Category> {
  #cache: Cache<DrivingTestQuestionWithKey<T>>;
  #browser: Browser | null = null;
  #page: Page | null = null;
  #state: DrivingTestState;
  #renderer: ReactiveRenderer;

  maximumEmptyAttempts: number;
  headless: boolean;
  timeout: number;
  maxAttempts: number;
  waitTime: number;
  emptyAttempts: number;
  category: T;
  subcategory: Subcategory<T> | "all";
  quizLength: number;

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
    this.quizLength = quizLength;
    // Initialize MST state for console UI only
    this.#state = DrivingTestStateModel.create({
      statusText: "Ready to start",
      status: "initializing",
      progress: {
        current: 0,
        total: 0,
        percentage: 0,
      },
      stats: {
        newQuestions: 0,
        totalQuestions: this.#cache.length,
        questionsByCategory: this.questionsByCategory,
        emptyAttempts: 0,
        maxEmptyAttempts: this.maximumEmptyAttempts,
      },
      lastError: null,
      currentUrl: this.#fullUrl,
    });

    // Initialize reactive renderer
    this.#renderer = new ReactiveRenderer(this.#state);
  }

  get #fullUrl() {
    return `${ENDPOINT_HOST}/${this.category}/${this.subcategory}/${this.quizLength}/`;
  }

  async #initialize(): Promise<void> {
    this.#state.setStatus("loading", "Initializing browser...");

    this.#browser = await puppeteer.launch({
      headless: this.headless,
      args: PUPPETEER_ARGS,
    });
    this.#page = await this.#browser.newPage();

    await this.#page.setUserAgent(USER_AGENT);
    await this.#page.setViewport(VIEWPORT);
    await this.#page.setExtraHTTPHeaders(EXTRA_HEADERS);

    this.#state.setStatus("ready", "Browser initialized");
  }

  async #close(): Promise<void> {
    if (this.#browser) {
      this.#state.setStatus("loading", "Closing browser...");

      await this.#browser.close();
      this.#browser = null;
      this.#page = null;

      this.#state.setStatus("finished", "Browser closed");
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
      this.#state.setLastError(
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

  async #fetchQuestion(): Promise<DrivingTestQuestionWithKey<T>> {
    if (!this.#page) {
      throw new Error("Scraper not initialized. Call initialize() first.");
    }

    try {
      this.#state.setStatus(
        "loading",
        `Scraping: ${this.category}/${this.subcategory}`,
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
      await this.#waitForQuestionToLoad();

      this.#state.setStatus("loading", "Extracting question data...");

      // Extract question from the page
      const question = await this.#extractQuestion();

      if (!question) {
        throw new Error("No question found");
      }

      this.#state.setStatus("loading", "Inferring answer...");

      const { answer, explanation } = await this.#inferAnswer(question);

      return {
        ...question,
        answer,
        explanation,
        key: makeKey(question),
        category: this.category,
        subcategory: this.subcategory as Subcategory<T>,
      };
    } catch (error) {
      console.error("Error during scraping:", error);
      throw error;
    }
  }

  get questionsByCategory() {
    return this.#cache.collection.filter(
      ({ value }) =>
        value.category === this.category &&
        value.subcategory === this.subcategory,
    ).length;
  }

  #store = (question: DrivingTestQuestionWithKey<T>) => {
    const isCached = Boolean(this.#cache.get(question.key));

    if (isCached) {
      this.emptyAttempts++;
    } else {
      this.emptyAttempts = 0;
      this.#cache.set(question.key, question);
    }

    const newQuestions = isCached ? 0 : 1;
    const questionsByCategory = this.questionsByCategory;
    const totalQuestions = this.#cache.length;

    this.#state.updateStats({
      newQuestions: this.#state.stats.newQuestions + newQuestions,
      totalQuestions,
      questionsByCategory,
      emptyAttempts: this.emptyAttempts,
      maxEmptyAttempts: this.maximumEmptyAttempts,
    });

    this.#state.setStatus(
      "loading",
      isCached
        ? `Question already cached (${this.emptyAttempts}/${this.maximumEmptyAttempts} empty attempts)`
        : `New question cached! Total: ${questionsByCategory}/${totalQuestions}`,
    );
  };

  process = async (): Promise<DrivingTestQuestionWithKey<T>[]> => {
    if (!this.#browser) {
      await this.#initialize();
    }

    this.#state.setStatus("loading", "Starting question processing...");
    this.#state.setProgress(0, this.maximumEmptyAttempts);

    while (this.emptyAttempts !== this.maximumEmptyAttempts) {
      try {
        const question = await this.#fetchQuestion();
        this.#store(question);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        this.#state.setLastError(errorMessage);
        this.#state.updateStats({
          emptyAttempts: this.emptyAttempts + 1,
        });

        // Continue trying instead of breaking on error
        this.emptyAttempts++;
      }

      this.#state.setProgress(this.emptyAttempts, this.maximumEmptyAttempts);
    }

    this.emptyAttempts = 0;

    return this.#cache.collection.map((q) => q.value);
  };

  async sync(): Promise<DrivingTestQuestionWithKey<T>[]> {
    // syncing all subcategories for a specific category
    const questions: DrivingTestQuestionWithKey<T>[] = [];
    if (this.subcategory === "all") {
      const subcategories = CATEGORIES[this.category as Category];
      for (const subcategory of subcategories) {
        this.subcategory = subcategory as Subcategory<T>;
        this.#state.setCurrentUrl(this.#fullUrl);
        const newQuestions = await this.process();
        questions.push(...newQuestions);
      }
    } else {
      const newQuestions = await this.process();
      questions.push(...newQuestions);
    }

    await this.#close();

    this.#state.setStatus(
      "finished",
      `Operation completed after ${this.maximumEmptyAttempts} empty attempts`,
    );

    this.#state.setProgress(
      this.maximumEmptyAttempts,
      this.maximumEmptyAttempts,
    );

    return questions;
  }

  // Cleanup method to dispose of the reactive renderer
  dispose(): void {
    this.#renderer.dispose();
  }
}
