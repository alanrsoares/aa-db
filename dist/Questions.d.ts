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
    random(length?: number): import("./Cache").CacheKey<Question>[];
    store: (questions: Question[]) => void;
    fetchQuestions(): Promise<Question[]>;
    sync(): Promise<unknown>;
}
export {};
