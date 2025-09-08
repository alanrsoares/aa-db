import { LowSync } from "lowdb";
import { JSONFileSyncPreset } from "lowdb/node";

const STD_TTL = 600;
const COLLECTION_ID = "cache";

// Initialize database with proper default data structure
const defaultData: Database<any> = { [COLLECTION_ID]: [] };
const DB = JSONFileSyncPreset<Database<any>>(
  `${__dirname}/../../db/db.json`,
  defaultData,
);

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

export default class Cache<T> {
  stdTTL: number;
  db: LowSync<Database<T>>;

  constructor({
    stdTTL = STD_TTL,
    db = DB,
  }: {
    stdTTL?: number;
    db?: typeof DB;
  }) {
    this.stdTTL = stdTTL;
    this.db = db;
  }

  get collection() {
    // Ensure data is properly initialized
    if (!this.db.data) {
      this.db.data = { [COLLECTION_ID]: [] };
    }
    return this.db.data[COLLECTION_ID];
  }

  get length() {
    return this.collection.length;
  }

  /**
   * Retrieves a value for a key
   *
   * @param {string} key
   */
  get(key: string) {
    const cached = this.collection.find(
      (item: CacheKey<T>) => item.key === key,
    );

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
    this.collection.push(item);
    this.db.write();
  }

  /**
   * Removes a key from the cache
   *
   * @param {string} key
   */
  invalidate(key: string) {
    const index = this.collection.findIndex(
      (item: CacheKey<T>) => item.key === key,
    );
    if (index !== -1) {
      this.collection.splice(index, 1);
      this.db.write();
    }
  }
}
