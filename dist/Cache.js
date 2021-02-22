"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var lowdb = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");

var STD_TTL = 600;
var COLLECTION_ID = "cache";

var adapter = new FileSync(__dirname + "/../db/db.json");
var DB = lowdb(adapter);

DB.defaults(_defineProperty({}, COLLECTION_ID, [])).write();

var isValidCacheKey = function isValidCacheKey(key, ttl) {
  return Math.floor((Date.now() - key.created) / 1000) <= ttl;
};

var CacheKey = function () {
  /**
   * Creates a new instance of CacheKey
   *
   * @param {string} key
   * @param {*} value
   */
  function CacheKey(key, value) {
    _classCallCheck(this, CacheKey);

    this.created = Date.now();
    Object.assign(this, { key: key, value: value });
  }

  /**
   * Creates a new instance of CacheKey
   *
   * @param {string} key
   * @param {*} value
   */


  _createClass(CacheKey, null, [{
    key: "make",
    value: function make(key, value) {
      return new CacheKey(key, value);
    }
  }]);

  return CacheKey;
}();

var Cache = function () {
  function Cache(_ref) {
    var _ref$stdTTL = _ref.stdTTL,
        stdTTL = _ref$stdTTL === undefined ? STD_TTL : _ref$stdTTL,
        _ref$db = _ref.db,
        db = _ref$db === undefined ? DB : _ref$db;

    _classCallCheck(this, Cache);

    this.stdTTL = stdTTL;
    this.db = db;
  }

  _createClass(Cache, [{
    key: "get",


    /**
     * Retrieves a value for a key
     *
     * @param {string} key
     */
    value: function get(key) {
      var cached = this.collection.find({ key: key }).value();

      return cached && isValidCacheKey(cached, this.stdTTL) ? cached.value : this.invalidate(key);
    }

    /**
     * Stores a value for a key
     * @param {string} key
     * @param {*} value
     */

  }, {
    key: "set",
    value: function set(key, value) {
      var item = CacheKey.make(key, value);
      this.collection.push(item).write();
    }

    /**
     * Removes a key from the cache
     *
     * @param {string} key
     */

  }, {
    key: "invalidate",
    value: function invalidate(key) {
      this.collection.remove({ key: key }).write();
    }
  }, {
    key: "collection",
    get: function get() {
      return this.db.get(COLLECTION_ID);
    }
  }, {
    key: "length",
    get: function get() {
      return this.collection.value().length;
    }
  }]);

  return Cache;
}();

module.exports = Cache;