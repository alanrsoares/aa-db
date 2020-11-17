import chalk from "chalk";
import fetch from "isomorphic-fetch";
import Cache from "./Cache";

import { parseProp, parseTags } from "./parsers";
import { uncapitalizeKeys, removeQueryString, randomInt } from "./utils";

const ENDPOINT_HOST = "http://www.aa.co.nz";

const QUESTIONS_ENDPOINT = `${ENDPOINT_HOST}/RoadCodeQuizController/getSet`;

const parseAnswers = (answers) => {
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

const parseImage = (image) => ({
  uri: removeQueryString(`${ENDPOINT_HOST}${parseProp("src")(image)}`),
});

const makeKey = ({ Question, RoadCodePage, CorrectAnswer }) =>
  `${Question}/${RoadCodePage}/${CorrectAnswer}`;

const clearLine = () => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
};

const refineQuestion = (question) =>
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

  store(questions) {
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
      return;
    }

    this.fetchQuestions()
      .then(this.store)
      .catch((e) => console.error(e));
  }
}
