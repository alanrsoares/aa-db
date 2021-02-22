import chalk from "chalk";
import fetch, { Response } from "node-fetch";

import Cache, { Question } from "./Cache";

import { ENDPOINT_HOST, IMAGE_PREFIX } from "./constants";
import { parseProp, parseTag, parseTags } from "./parsers";
import syncAssets from "./syncAssets";
import { uncapitalizeKeys, removeQueryString } from "./utils";

const QUESTIONS_ENDPOINT = `${ENDPOINT_HOST}/RoadCodeQuizController/getSet`;

/**
 *
 * @param {string} answers
 * @returns {Record<string,string>} parsed
 */
function parseAnswers(answers: string = ""): Record<string, string> {
  const links = parseTags("a")(answers) as string[];

  const contents = links.map(parseTag("a"));

  const spans = contents.map(parseTags("span")) as [string, string][];

  const spanContent = parseTag("span");

  return spans.reduce(
    (acc, [option, content]) => ({
      ...acc,
      [spanContent(option)]: spanContent(content).trim(),
    }),
    {}
  );
}

function parseImage(image = "") {
  const uri = removeQueryString(
    `${ENDPOINT_HOST}${parseProp("src")(image)}`
  ).replace(IMAGE_PREFIX, "");

  return { uri };
}

interface QuestionDTO {
  Question: string;
  Answers: string;
  CorrectAnswer: string;
  RoadCodePage: string;
  Image: string;
}

/**
 *
 * @param {QuestionDTO} data
 */
const makeKey = (data: QuestionDTO) =>
  `${data.Question}/${data.RoadCodePage}/${data.CorrectAnswer}`;

function clearLine() {
  process.stdout.clearLine(-1);
  process.stdout.cursorTo(0);
}

/**
 *
 * @param {{ Image: string, Answers: string }} question
 */
const refineQuestion = (question: QuestionDTO) =>
  uncapitalizeKeys({
    ...question,
    key: makeKey(question),
    Image: parseImage(question.Image),
    Answers: parseAnswers(question.Answers),
  }) as Question;

/**
 * unwrap
 *
 * @param {Response} res
 */
const unwrap = (res: Response) => res.json();

/**
 * refine
 *
 * @param {Record<string,string>[]} data
 */
const refine = (data: QuestionDTO[]) =>
  Promise.resolve(data.map(refineQuestion));

interface QuestionsConfig {
  cache: Cache;
  endpoint?: string;
  maximumEmptyAttempts?: number;
}

export default class Questions {
  cache: Cache;
  endpoint: string;
  maximumEmptyAttempts: number;
  emptyAttempts: number;

  constructor({
    cache,
    endpoint = QUESTIONS_ENDPOINT,
    maximumEmptyAttempts = 20,
  }: QuestionsConfig) {
    if (!(cache instanceof Cache)) {
      throw new Error("Invalid argument 'cache'");
    }
    this.cache = cache;
    this.endpoint = endpoint;
    this.maximumEmptyAttempts = maximumEmptyAttempts;
    this.emptyAttempts = 0;
  }

  store = (questions: Question[]) => {
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
  };

  async fetchQuestions() {
    const res = await fetch(this.endpoint);
    const questions = (await unwrap(res)) as QuestionDTO[];

    return refine(questions);
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
