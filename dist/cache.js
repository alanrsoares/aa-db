'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _fileSync = require('lowdb/file-sync');

var _fileSync2 = _interopRequireDefault(_fileSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COLLECTION_ID = 'cache';

var createDB = (0, _lowdb2.default)(__dirname + '/db.json', { storage: _fileSync2.default });

var isValidCacheKey = function isValidCacheKey(key, ttl) {
	return Math.floor((Date.now() - key.created) / 1000) <= ttl;
};

var CacheKey = function CacheKey(key, value) {
	_classCallCheck(this, CacheKey);

	this.created = Date.now();
	Object.assign(this, { key: key, value: value });
};

var Cache = (function () {
	function Cache(_ref) {
		var stdTTL = _ref.stdTTL;
		var _ref$db = _ref.db;
		var db = _ref$db === undefined ? createDB(COLLECTION_ID) : _ref$db;

		_classCallCheck(this, Cache);

		this.stdTTL = stdTTL || 600;
		this.db = db;
	}

	_createClass(Cache, [{
		key: 'get',
		value: function get(key) {
			var cached = this.db.find({ key: key });

			return cached && isValidCacheKey(cached, this.stdTTL) ? cached.value : this.invalidate(key);
		}
	}, {
		key: 'set',
		value: function set(key, value) {
			this.db.push(new CacheKey(key, value));
		}
	}, {
		key: 'invalidate',
		value: function invalidate(key) {
			this.db.remove({ key: key });
		}
	}]);

	return Cache;
})();

exports.default = Cache;