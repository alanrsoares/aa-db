import chalk from "chalk";
import db from ".";

import syncAssets from "./syncAssets";

db.sync()
  .then(syncAssets)
  .catch((e) => {
    console.log(chalk.bold.red(e.message));
    process.exit(1);
  });
