/// <reference types="lodash" />
import lowdb from "lowdb";
export declare class CacheKey<T> {
    created: number;
    key: string;
    value: T;
    /**
     * Creates a new instance of CacheKey
     *
     * @param {string} key
     * @param {*} value
     */
    constructor(key: string, value: T);
    /**
     * Creates a new instance of CacheKey
     *
     * @param {string} key
     * @param {*} value
     */
    static make<T>(key: string, value: T): CacheKey<T>;
}
export interface Database<T> {
    cache: CacheKey<T>[];
}
export interface Question {
    question: string;
    answers: Record<string, string>;
    correctAnswer: string;
    roadCodePage: string;
    image: {
        uri: string;
    };
    key: string;
}
export default class Cache {
    stdTTL: number;
    db: lowdb.LowdbSync<Database<Question>>;
    constructor({ stdTTL, db }: {
        stdTTL?: number | undefined;
        db?: lowdb.LowdbSync<any> | undefined;
    });
    get collection(): import("lodash").CollectionChain<CacheKey<Question>>;
    get length(): number;
    /**
     * Retrieves a value for a key
     *
     * @param {string} key
     */
    get(key: string): void | Question;
    /**
     * Stores a value for a key
     * @param {string} key
     * @param {*} value
     */
    set(key: string, value: any): void;
    /**
     * Removes a key from the cache
     *
     * @param {string} key
     */
    invalidate(key: string): void;
}
