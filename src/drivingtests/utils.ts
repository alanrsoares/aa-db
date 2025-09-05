import type { Question } from "./types";

/**
 * Clear the current console output line
 */
export function clearLine() {
  process.stdout.clearLine(-1);
  process.stdout.cursorTo(0);
}

export function writeLine(...line: string[]) {
  process.stdout.write(line.join("\n"));
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
export function makeKey(question: Omit<Question, "key">) {
  const questionText = question.question.trim();
  const optionsText = question.options
    .map((opt) => `${opt.letter}${opt.text}`)
    .join("|");

  return quickHash(`${questionText}/${optionsText}`).toString(36).slice(0, 10);
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
