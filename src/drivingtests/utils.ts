import { Question } from "../Cache";
import { DrivingTestQuestion, EndpointInfo } from "./types";

export function clearLine() {
  process.stdout.clearLine(-1);
  process.stdout.cursorTo(0);
}

function quickHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return hash;
}

/**
 * Creates a unique key for a driving test question
 */
export function makeKey(question: DrivingTestQuestion) {
  const questionText = question.question.trim();
  const optionsText = question.options
    .map((opt) => `${opt.letter}${opt.text}`)
    .join("|");

  return quickHash(`${questionText}/${optionsText}`).toString(36).slice(0, 10);
}

/**
 * Converts a driving test question to the cache format
 */
export function toDBQuestion(
  question: DrivingTestQuestion,
  endpointInfo: EndpointInfo
): Question {
  const options = Object.fromEntries(
    question.options.map((option) => [
      option.letter.replace(".", ""),
      option.text,
    ])
  );

  return {
    options,
    key: makeKey(question),
    question: question.question,
    answer: question.answer ?? "",
    category: endpointInfo.category,
    subcategory: endpointInfo.subcategory,
    imageUrl: question.imageUrl ?? "",
    explanation: question.explanation,
  };
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
