import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";

import Cache from "../Cache";
import {
  CATEGORIES,
  ONE_WEEK,
  type Category,
  type Subcategory,
} from "../config";
import DrivingTestsQuestions from "./DrivingTestsQuestions";

const program = new Command();

await program
  .command("sync")
  .description("Sync driving test questions")
  .option(
    "-c, --category <category>",
    "The category of the driving test questions",
  )
  .option(
    "-s, --subcategory <subcategory>",
    "The subcategory of the driving test questions",
  )
  .option("-h, --headless", "Run the browser in headless mode", false)
  .action(async (args) => {
    let { category, subcategory, headless } = args;

    if (!category || !subcategory) {
      category = await select({
        message: "Select the category of the driving test questions",
        choices: Object.keys(CATEGORIES),
      });

      if (!category) {
        console.log(chalk.bold.red("No category selected"));
        process.exit(1);
      }

      subcategory = await select({
        message: "Select the subcategory of the driving test questions",
        choices: CATEGORIES[category as Category],
      });

      if (!subcategory) {
        console.log(chalk.bold.red("No subcategory selected"));
        process.exit(1);
      }
    }

    const db = new DrivingTestsQuestions({
      cache: new Cache({ stdTTL: ONE_WEEK }),
      maximumEmptyAttempts: 25, // Higher limit since we're scraping a website
      headless,
      timeout: 10_000,
      maxAttempts: 10,
      waitTime: 500,
      category: category as Category,
      subcategory: subcategory as Subcategory<Category>,
    });

    try {
      const questions = await db.sync();
      console.log(
        chalk.bold.green(
          `\n✅ Successfully synced ${questions.length} driving test questions!`,
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log(chalk.bold.red(error.message));
      } else {
        console.log(chalk.bold.red("An unknown error occurred"));
      }
      process.exit(1);
    }
  })
  .parseAsync(process.argv);
