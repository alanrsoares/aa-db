import chalk from "chalk";
import puppeteer, { Browser, Page } from "puppeteer";

import Cache from "~/Cache";
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
} from "~/config";
import type {
  Answer,
  DrivingTestQuestionWithKey,
  DrivingTestsQuestionsConfig,
  Explanation,
  Option,
  Question,
} from "./types";
import { clearConsole, delay, makeKey } from "./utils";

type State<T extends Category> = {
  questions: DrivingTestQuestionWithKey<T>[];
  currentQuestionIndex: number;
  currentQuestion: DrivingTestQuestionWithKey<T> | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isFinished: boolean;
  // Rendering state
  status: string;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  stats: {
    newQuestions: number;
    totalQuestions: number;
    questionsByCategory: number;
    emptyAttempts: number;
    maxEmptyAttempts: number;
  };
  lastError: string | null;
  currentUrl: string;
};

export default class DrivingTestsQuestions<T extends Category> {
  #cache: Cache<DrivingTestQuestionWithKey<T>>;
  #browser: Browser | null = null;
  #page: Page | null = null;
  #fullUrl: string;
  #state: State<T> = {
    questions: [],
    currentQuestionIndex: 0,
    currentQuestion: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isFinished: false,
    // Rendering state
    status: "Initializing...",
    progress: {
      current: 0,
      total: 0,
      percentage: 0,
    },
    stats: {
      newQuestions: 0,
      totalQuestions: 0,
      questionsByCategory: 0,
      emptyAttempts: 0,
      maxEmptyAttempts: 0,
    },
    lastError: null,
    currentUrl: "",
  };

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

    // Initialize state with proper values
    this.#state = {
      ...this.#state,
      stats: {
        newQuestions: 0,
        totalQuestions: this.#cache.length,
        questionsByCategory: this.questionsByCategory,
        emptyAttempts: 0,
        maxEmptyAttempts: this.maximumEmptyAttempts,
      },
      currentUrl: this.#fullUrl,
      status: "Ready to start",
    };
  }

  async #initialize(): Promise<void> {
    await this.#setState({
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

    await this.#setState({
      status: "Browser initialized",
      isLoading: false,
    });
  }

  async #close(): Promise<void> {
    if (this.#browser) {
      await this.#setState({
        status: "Closing browser...",
      });

      await this.#browser.close();
      this.#browser = null;
      this.#page = null;

      await this.#setState({
        status: "Browser closed",
      });
    }
  }

  async #setState(state: Partial<State<T>>, render = true): Promise<void> {
    this.#state = { ...this.#state, ...state };
    if (render) {
      await this.#render();
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
      await this.#setState({
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
      await this.#setState({
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

      await this.#setState({
        status: "Extracting question data...",
      });

      // Extract question from the page
      const question = await this.#extractQuestion();

      if (!question) {
        throw new Error("No question found");
      }

      await this.#setState({
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

  #store = async (question: DrivingTestQuestionWithKey<T>) => {
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

    await this.#setState({
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

  process = async (): Promise<State<T>> => {
    await this.#initialize();

    try {
      await this.#setState({
        status: "Starting question processing...",
        progress: {
          current: 0,
          total: this.maximumEmptyAttempts,
          percentage: 0,
        },
      });

      while (this.emptyAttempts !== this.maximumEmptyAttempts) {
        try {
          await this.#fetchQuestion().then(this.#store);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          await this.#setState({
            lastError: errorMessage,
            stats: {
              ...this.#state.stats,
              emptyAttempts: this.emptyAttempts + 1,
            },
          });
          // Continue trying instead of breaking on error
          this.emptyAttempts++;
        }

        // Update progress
        const progressPercentage =
          (this.emptyAttempts / this.maximumEmptyAttempts) * 100;
        await this.#setState({
          progress: {
            current: this.emptyAttempts,
            total: this.maximumEmptyAttempts,
            percentage: progressPercentage,
          },
        });
      }

      await this.#setState({
        status: `Operation completed after ${this.maximumEmptyAttempts} empty attempts`,
        isFinished: true,
        progress: {
          current: this.maximumEmptyAttempts,
          total: this.maximumEmptyAttempts,
          percentage: 100,
        },
      });

      return this.#state;
    } finally {
      await this.#close();
    }
  };

  async #render(): Promise<void> {
    clearConsole();

    const { status, progress, stats, lastError, currentUrl } = this.#state;

    // Header
    console.log(chalk.bold.blue("🚗 Driving Test Questions Scraper"));
    console.log(chalk.gray("=".repeat(50)));

    // Status
    console.log(chalk.bold.yellow(`Status: ${status}`));

    // URL being scraped
    if (currentUrl) {
      console.log(chalk.cyan(`URL: ${currentUrl}`));
    }

    // Progress bar
    if (progress.total > 0) {
      const barLength = 30;
      const filledLength = Math.round((progress.percentage / 100) * barLength);
      const bar =
        "█".repeat(filledLength) + "░".repeat(barLength - filledLength);
      console.log(
        chalk.green(
          `Progress: [${bar}] ${progress.percentage.toFixed(1)}% (${progress.current}/${progress.total})`,
        ),
      );
    }

    // Stats
    console.log(chalk.bold.blue("\n📊 Statistics:"));
    console.log(
      chalk.green(`  New questions this session: ${stats.newQuestions}`),
    );
    console.log(
      chalk.cyan(`  Questions in category: ${stats.questionsByCategory}`),
    );
    console.log(
      chalk.blue(`  Total questions cached: ${stats.totalQuestions}`),
    );
    console.log(
      chalk.yellow(
        `  Empty attempts: ${stats.emptyAttempts}/${stats.maxEmptyAttempts}`,
      ),
    );

    // Error display
    if (lastError) {
      console.log(chalk.bold.red(`\n❌ Last Error: ${lastError}`));
    }

    // Footer
    console.log(chalk.gray("\n" + "=".repeat(50)));
  }

  async sync(): Promise<State<T>> {
    // syncing all subcategories for a specific category
    if (this.subcategory === "all") {
      const questions: DrivingTestQuestionWithKey<T>[] = [];
      const subcategories = CATEGORIES[this.category as Category];
      for (const subcategory of subcategories) {
        this.subcategory = subcategory as Subcategory<T>;
        const newQuestions = await this.process();
        questions.push(...newQuestions.questions);
      }
      return {
        ...this.#state,
        questions: [...this.#state.questions, ...questions],
      };
    }

    return await this.process();
  }
}
