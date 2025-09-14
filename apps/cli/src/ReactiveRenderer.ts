import type {
  DrivingTestState,
  IReactiveRenderer,
  StatusKind,
} from "@roadcodetests/core";
import chalk, { type Chalk } from "chalk";
import { reaction, type IReactionDisposer } from "mobx";

const components = {
  dividerLine(length: number) {
    return `\n${chalk.gray("=".repeat(length))}\n`;
  },
  progressBar(percentage: number, barLength = 30) {
    const filledLength = Math.round((percentage / 100) * barLength);
    const filledSegment = "█".repeat(filledLength);
    const emptySegment = "░".repeat(barLength - filledLength);
    return `[${filledSegment}${emptySegment}] ${percentage.toFixed(1)}%`;
  },
};

const statusStyles = {
  error: chalk.red,
  loading: chalk.yellow,
  finished: chalk.green,
  initializing: chalk.blue,
  ready: chalk.blue,
} as const satisfies Record<StatusKind, Chalk>;

export class ReactiveRenderer implements IReactiveRenderer {
  #disposer: IReactionDisposer | null = null;
  #isRendering = false;
  #state: DrivingTestState;

  constructor(state: DrivingTestState) {
    this.#state = state;
    this.#setupReactions();
  }

  #setupReactions() {
    // React to any state changes and re-render
    this.#disposer = reaction(
      () => ({
        statusText: this.#state.statusText,
        status: this.#state.status,
        progress: this.#state.progress,
        stats: this.#state.stats,
        lastError: this.#state.lastError,
        currentUrl: this.#state.currentUrl,
        hasErrors: this.#state.hasErrors,
        isComplete: this.#state.isComplete,
      }),
      () => {
        this.#render();
      },
      {
        fireImmediately: true,
      },
    );
  }

  #render() {
    if (this.#isRendering) return;
    this.#isRendering = true;

    // Clear console
    console.clear();

    const {
      progress,
      stats,
      lastError,
      currentUrl,
      hasErrors,
      status,
      statusText,
    } = this.#state;

    // Header
    console.log(chalk.bold.blue("🚗 Driving Test Questions Scraper"));
    console.log(components.dividerLine(50));

    // Status with loading indicator
    const statusColor = statusStyles[status];
    const loadingIndicator = status === "loading" ? " ⏳" : "";
    console.log(statusColor(`Status: ${statusText}${loadingIndicator}`));

    // URL being scraped
    if (currentUrl) {
      console.log(chalk.cyan(`URL: ${currentUrl}`));
    }

    // Progress bar
    if (progress.total) {
      const bar = components.progressBar(progress.percentage);
      console.log(
        chalk.green(`Progress: ${bar} (${progress.current}/${progress.total})`),
      );
    }

    // Stats
    console.log(chalk.bold.blue("\n📊 Statistics:"));
    console.log(
      chalk.green(` * New questions this session: ${stats.newQuestions}`),
    );
    console.log(
      chalk.cyan(` * Questions in category: ${stats.questionsByCategory}`),
    );
    console.log(
      chalk.blue(` * Total questions cached: ${stats.totalQuestions}`),
    );
    console.log(
      chalk.yellow(
        ` * Empty attempts: ${stats.emptyAttempts}/${stats.maxEmptyAttempts}`,
      ),
    );

    // Error display
    if (lastError) {
      console.log(chalk.bold.red(`\n❌ Last Error: ${lastError}`));
    }

    // Success message
    if (status === "finished" && !hasErrors) {
      console.log(chalk.bold.green(`\n✅ Operation completed successfully!`));
    }

    // Footer
    console.log(components.dividerLine(50));

    this.#isRendering = false;
  }

  dispose() {
    if (this.#disposer) {
      this.#disposer();
      this.#disposer = null;
    }
  }
}
