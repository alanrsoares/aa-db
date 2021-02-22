import chalk from "chalk";
import fetch from "node-fetch";

import Cache from "./Cache";

import { ENDPOINT_HOST, IMAGE_PREFIX } from "./constants";
import { parseProp, parseTags } from "./parsers";
import syncAssets from "./syncAssets";
import { uncapitalizeKeys, removeQueryString, randomInt } from "./utils";

const QUESTIONS_ENDPOINT = `${ENDPOINT_HOST}/RoadCodeQuizController/getSet`;

const parseAnswers = (answers = "") => {
  const links = parseTags("a", "g")(answers);
  const contents = links.map(parseTags("a"));
  const spans = contents.map(parseTags("span", "g"));
  const spanContent = parseTags("span");

  return spans.reduce(
    (acc, [option, content]) => ({
      ...acc,
      [spanContent(option)]: spanContent(content).trim(),
    }),
    {}
  );
};

function parseImage(image = "") {
  const uri = removeQueryString(
    `${ENDPOINT_HOST}${parseProp("src")(image)}`
  ).replace(IMAGE_PREFIX, "");

  return { uri };
}

const makeKey = ({ Question, RoadCodePage, CorrectAnswer }) =>
  `${Question}/${RoadCodePage}/${CorrectAnswer}`;

function clearLine() {
  process.stdout.clearLine(-1);
  process.stdout.cursorTo(0);
}

const refineQuestion = (question = {}) =>
  uncapitalizeKeys({
    ...question,
    key: makeKey(question),
    Image: parseImage(question.Image),
    Answers: parseAnswers(question.Answers),
  });

const unwrap = (res) => res.json();

const refine = (data) => Promise.resolve(data.map(refineQuestion));

export default class Questions {
  constructor({
    cache,
    endpoint = QUESTIONS_ENDPOINT,
    maximumEmptyAttempts = 20,
  }) {
    if (!(cache instanceof Cache)) {
      throw new Error("Invalid argument 'cache'");
    }
    Object.assign(this, {
      endpoint,
      cache,
      maximumEmptyAttempts,
      emptyAttempts: 0,
      store: this.store.bind(this),
    });
  }

  random(length = 30) {
    const result = [];
    const questions = this.cache.db.toJSON().map((x) => x.value);

    for (let i = 0; i < length; i++) {
      const index = randomInt({ max: questions.length - 1 });
      result.push(...questions.splice(index, 1));
    }

    return result;
  }

  store(questions = []) {
    const uncachedQuestions = questions.filter((q) => !this.cache.get(q.key));

    clearLine();

    if (!uncachedQuestions.length) {
      this.emptyAttempts++;
    } else {
      this.emptyAttempts = 0;
      uncachedQuestions.forEach((q) => this.cache.set(q.key, q));
    }

    process.stdout.write(
      `New questions cached: ${chalk.bold.green(
        uncachedQuestions.length
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

    this.sync();
  }

  async fetchQuestions() {
    const res = await fetch(this.endpoint);
    const data = await unwrap(res);

    return refine(data);
  }

  sync() {
    return new Promise((resolve, reject) => {
      if (this.emptyAttempts >= this.maximumEmptyAttempts) {
        clearLine();

        console.log(
          `Operation cancelled after ${chalk.bold.red(
            this.maximumEmptyAttempts
          )} empty attempts.`
        );
        console.log(
          `Total questions cached: ${chalk.bold.cyan(this.cache.length)}.`
        );
        const cached = this.cache.collection.value();

        syncAssets(cached);

        resolve(cached);
      } else {
        this.fetchQuestions()
          .then(this.store)
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      }
    });
  }
}
