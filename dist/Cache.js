"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lowdb = require("lowdb");

var _lowdb2 = _interopRequireDefault(_lowdb);

var _FileSync = require("lowdb/adapters/FileSync");

var _FileSync2 = _interopRequireDefault(_FileSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var STD_TTL = 600;
var COLLECTION_ID = "cache";

var adapter = new _FileSync2.default(__dirname + "/../db/db.json");
var DB = (0, _lowdb2.default)(adapter);

DB.defaults(_defineProperty({}, COLLECTION_ID, [])).write();

var isValidCacheKey = function isValidCacheKey(key, ttl) {
  return Math.floor((Date.now() - key.created) / 1000) <= ttl;
};

var CacheKey = function CacheKey(key, value) {
  _classCallCheck(this, CacheKey);

  this.created = Date.now();
  Object.assign(this, { key: key, value: value });
};

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
    value: function get(key) {
      var cached = this.db.get(COLLECTION_ID).find({ key: key }).value();

      return cached && isValidCacheKey(cached, this.stdTTL) ? cached.value : this.invalidate(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this.db.get(COLLECTION_ID).push(new CacheKey(key, value)).write();
    }
  }, {
    key: "invalidate",
    value: function invalidate(key) {
      this.db.get(COLLECTION_ID).remove({ key: key }).write();
    }
  }, {
    key: "length",
    get: function get() {
      return this.db.get(COLLECTION_ID).value().length;
    }
  }]);

  return Cache;
}();

exports.default = Cache;