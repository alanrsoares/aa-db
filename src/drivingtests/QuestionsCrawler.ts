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
  DeepPartial,
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
  #fullUrl: string;
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

    // Initialize MST state for console UI only
    this.#state = DrivingTestStateModel.create({
      status: "Ready to start",
      isLoading: false,
      isError: false,
      isFinished: false,
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

  async #initialize(): Promise<void> {
    this.#setState({
      status: "Initializing browser...",
      isLoading: true,
    });

    this.#browser = await puppeteer.launch({
      headless: this.headless,
      args: PUPPETEER_ARGS,
    });
    this.#page = await this.#browser.newPage();

    await this.#page.setUserAgent(USER_AGENT);
    await this.#page.setViewport(VIEWPORT);
    await this.#page.setExtraHTTPHeaders(EXTRA_HEADERS);

    this.#setState({
      status: "Browser initialized",
      isLoading: false,
    });
  }

  async #close(): Promise<void> {
    if (this.#browser) {
      this.#setState({
        status: "Closing browser...",
      });

      await this.#browser.close();
      this.#browser = null;
      this.#page = null;

      this.#setState({
        status: "Browser closed",
      });
    }
  }

  // MST actions are automatically reactive, no need for manual rendering
  #setState(updates: DeepPartial<DrivingTestState>): void {
    if (updates.status) this.#state.setStatus(updates.status);
    if (updates.isLoading !== undefined)
      this.#state.setLoading(updates.isLoading);
    if (updates.isError !== undefined) this.#state.setError(updates.isError);
    if (updates.isFinished !== undefined)
      this.#state.setFinished(updates.isFinished);
    if (updates.lastError !== undefined)
      this.#state.setLastError(updates.lastError);
    if (updates.currentUrl) this.#state.setCurrentUrl(updates.currentUrl);
    if (updates.progress) {
      const { current, total, percentage } = updates.progress;
      if (
        current !== undefined &&
        total !== undefined &&
        percentage !== undefined
      ) {
        this.#state.setProgress(current, total, percentage);
      }
    }
    if (updates.stats) {
      this.#state.updateStats(updates.stats);
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
      this.#setState({
        lastError: `Error inferring answer for question: ${question.question.substring(
          0,
          50,
        )}... - ${errorMessage}`,
      });
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
      this.#setState({
        status: `Scraping: ${this.category}/${this.subcategory}`,
        isLoading: true,
      });

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

      this.#setState({
        status: "Extracting question data...",
      });

      // Extract question from the page
      const question = await this.#extractQuestion();

      if (!question) {
        throw new Error("No question found");
      }

      this.#setState({
        status: "Inferring answer...",
      });

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

    this.#setState({
      stats: {
        newQuestions: this.#state.stats.newQuestions + newQuestions,
        totalQuestions,
        questionsByCategory,
        emptyAttempts: this.emptyAttempts,
        maxEmptyAttempts: this.maximumEmptyAttempts,
      },
      status: isCached
        ? `Question already cached (${this.emptyAttempts}/${this.maximumEmptyAttempts} empty attempts)`
        : `New question cached! Total: ${questionsByCategory}/${totalQuestions}`,
    });
  };

  process = async (): Promise<DrivingTestQuestionWithKey<T>[]> => {
    await this.#initialize();

    try {
      this.#setState({
        status: "Starting question processing...",
        progress: {
          current: 0,
          total: this.maximumEmptyAttempts,
          percentage: 0,
        },
      });

      while (this.emptyAttempts !== this.maximumEmptyAttempts) {
        try {
          const question = await this.#fetchQuestion();
          this.#store(question);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          this.#setState({
            lastError: errorMessage,
            stats: {
              emptyAttempts: this.emptyAttempts + 1,
            },
          });
          // Continue trying instead of breaking on error
          this.emptyAttempts++;
        }

        // Update progress
        const progressPercentage =
          (this.emptyAttempts / this.maximumEmptyAttempts) * 100;
        this.#setState({
          progress: {
            current: this.emptyAttempts,
            total: this.maximumEmptyAttempts,
            percentage: progressPercentage,
          },
        });
      }

      this.#setState({
        status: `Operation completed after ${this.maximumEmptyAttempts} empty attempts`,
        isFinished: true,
        progress: {
          current: this.maximumEmptyAttempts,
          total: this.maximumEmptyAttempts,
          percentage: 100,
        },
      });

      return this.#cache.collection.map((q) => q.value);
    } finally {
      await this.#close();
    }
  };

  async sync(): Promise<DrivingTestQuestionWithKey<T>[]> {
    // syncing all subcategories for a specific category
    if (this.subcategory === "all") {
      const questions: DrivingTestQuestionWithKey<T>[] = [];
      const subcategories = CATEGORIES[this.category as Category];
      for (const subcategory of subcategories) {
        this.subcategory = subcategory as Subcategory<T>;
        const newQuestions = await this.process();
        questions.push(...newQuestions);
      }
      return questions;
    }

    return await this.process();
  }

  // Cleanup method to dispose of the reactive renderer
  dispose(): void {
    this.#renderer.dispose();
  }
}
