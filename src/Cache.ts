import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const STD_TTL = 600;
const COLLECTION_ID = "cache";

const adapter = new FileSync(`${__dirname}/../db/db.json`);

const DB = lowdb(adapter);

DB.defaults({ [COLLECTION_ID]: [] }).write();

const isValidCacheKey = (key: { created: number }, ttl: number) =>
  Math.floor((Date.now() - key.created) / 1000) <= ttl;

export class CacheKey<T> {
  created: number;
  key: string;
  value: T;

  /**
   * Creates a new instance of CacheKey
   *
   * @param {string} key
   * @param {*} value
   */
  constructor(key: string, value: T) {
    this.created = Date.now();
    this.key = key;
    this.value = value;
  }

  /**
   * Creates a new instance of CacheKey
   *
   * @param {string} key
   * @param {*} value
   */
  static make<T>(key: string, value: T) {
    return new CacheKey(key, value);
  }
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
  constructor({ stdTTL = STD_TTL, db = DB }) {
    this.stdTTL = stdTTL;
    this.db = db;
  }

  get collection() {
    return this.db.get(COLLECTION_ID);
  }

  get length() {
    return this.collection.value().length;
  }

  /**
   * Retrieves a value for a key
   *
   * @param {string} key
   */
  get(key: string) {
    const cached = this.collection.find({ key }).value();

    return cached && isValidCacheKey(cached, this.stdTTL)
      ? cached.value
      : this.invalidate(key);
  }

  /**
   * Stores a value for a key
   * @param {string} key
   * @param {*} value
   */
  set(key: string, value: any) {
    const item = CacheKey.make(key, value);
    this.collection.push(item).write();
  }

  /**
   * Removes a key from the cache
   *
   * @param {string} key
   */
  invalidate(key: string) {
    this.collection.remove({ key }).write();
  }
}
