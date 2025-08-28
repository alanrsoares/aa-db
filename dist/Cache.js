"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheKey = void 0;
var tslib_1 = require("tslib");
var lowdb_1 = tslib_1.__importDefault(require("lowdb"));
var FileSync_1 = tslib_1.__importDefault(require("lowdb/adapters/FileSync"));
var STD_TTL = 600;
var COLLECTION_ID = "cache";
var adapter = new FileSync_1.default("".concat(__dirname, "/../db/db.json"));
var DB = (0, lowdb_1.default)(adapter);
DB.defaults((_a = {}, _a[COLLECTION_ID] = [], _a)).write();
var isValidCacheKey = function (key, ttl) {
    return Math.floor((Date.now() - key.created) / 1000) <= ttl;
};
var CacheKey = /** @class */ (function () {
    /**
     * Creates a new instance of CacheKey
     *
     * @param {string} key
     * @param {*} value
     */
    function CacheKey(key, value) {
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
    CacheKey.make = function (key, value) {
        return new CacheKey(key, value);
    };
    return CacheKey;
}());
exports.CacheKey = CacheKey;
var Cache = /** @class */ (function () {
    function Cache(_a) {
        var _b = _a.stdTTL, stdTTL = _b === void 0 ? STD_TTL : _b, _c = _a.db, db = _c === void 0 ? DB : _c;
        this.stdTTL = stdTTL;
        this.db = db;
    }
    Object.defineProperty(Cache.prototype, "collection", {
        get: function () {
            return this.db.get(COLLECTION_ID);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "length", {
        get: function () {
            return this.collection.value().length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Retrieves a value for a key
     *
     * @param {string} key
     */
    Cache.prototype.get = function (key) {
        var cached = this.collection.find({ key: key }).value();
        return cached && isValidCacheKey(cached, this.stdTTL)
            ? cached.value
            : this.invalidate(key);
    };
    /**
     * Stores a value for a key
     * @param {string} key
     * @param {*} value
     */
    Cache.prototype.set = function (key, value) {
        var item = CacheKey.make(key, value);
        this.collection.push(item).write();
    };
    /**
     * Removes a key from the cache
     *
     * @param {string} key
     */
    Cache.prototype.invalidate = function (key) {
        this.collection.remove({ key: key }).write();
    };
    return Cache;
}());
exports.default = Cache;
//# sourceMappingURL=Cache.js.map