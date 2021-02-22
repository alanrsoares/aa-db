import Cache, { Question } from "./Cache";
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
    constructor({ cache, endpoint, maximumEmptyAttempts, }: QuestionsConfig);
    store: (questions: Question[]) => void;
    fetchQuestions: () => Promise<Question[]>;
    sync: () => Promise<import("./Cache").CacheKey<Question>[]>;
}
export {};
