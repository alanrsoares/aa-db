import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const STD_TTL = 600;
const COLLECTION_ID = "cache";

const adapter = new FileSync(`${__dirname}/../db/db.json`);
const DB = lowdb(adapter);

DB.defaults({ [COLLECTION_ID]: [] }).write();

const isValidCacheKey = (key, ttl) =>
  Math.floor((Date.now() - key.created) / 1000) <= ttl;

class CacheKey {
  constructor(key, value) {
    this.created = Date.now();
    Object.assign(this, { key, value });
  }
}

export default class Cache {
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

  get(key) {
    const cached = this.collection.find({ key }).value();

    return cached && isValidCacheKey(cached, this.stdTTL)
      ? cached.value
      : this.invalidate(key);
  }

  set(key, value) {
    this.collection.push(new CacheKey(key, value)).write();
  }

  invalidate(key) {
    this.collection.remove({ key }).write();
  }
}
