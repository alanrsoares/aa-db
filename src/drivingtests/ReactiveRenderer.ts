import chalk from "chalk";
import { reaction, type IReactionDisposer } from "mobx";

import type { DrivingTestState } from "./models";

export class ReactiveRenderer {
  private disposer: IReactionDisposer | null = null;
  private isRendering = false;

  constructor(private state: DrivingTestState) {
    this.setupReactions();
  }

  private setupReactions() {
    // React to any state changes and re-render
    this.disposer = reaction(
      () => ({
        status: this.state.status,
        progress: this.state.progress,
        stats: this.state.stats,
        lastError: this.state.lastError,
        currentUrl: this.state.currentUrl,
        isLoading: this.state.isLoading,
        isError: this.state.isError,
        isFinished: this.state.isFinished,
      }),
      () => {
        this.render();
      },
      {
        fireImmediately: true,
      },
    );
  }

  private render() {
    if (this.isRendering) return;
    this.isRendering = true;

    // Clear console
    console.clear();

    const {
      status,
      progress,
      stats,
      lastError,
      currentUrl,
      isLoading,
      isError,
      isFinished,
    } = this.state;

    // Header
    console.log(chalk.bold.blue("🚗 Driving Test Questions Scraper"));
    console.log(chalk.gray("=".repeat(50)));

    // Status with loading indicator
    const statusColor = isError
      ? chalk.red
      : isLoading
        ? chalk.yellow
        : isFinished
          ? chalk.green
          : chalk.blue;
    const loadingIndicator = isLoading ? " ⏳" : "";
    console.log(statusColor(`Status: ${status}${loadingIndicator}`));

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

    // Success message
    if (isFinished && !isError) {
      console.log(chalk.bold.green(`\n✅ Operation completed successfully!`));
    }

    // Footer
    console.log(chalk.gray("\n" + "=".repeat(50)));

    this.isRendering = false;
  }

  dispose() {
    if (this.disposer) {
      this.disposer();
      this.disposer = null;
    }
  }
}
