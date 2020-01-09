"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-polyfill");

var _Cache = require("./Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _Questions = require("./Questions");

var _Questions2 = _interopRequireDefault(_Questions);

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = new _Questions2.default({
  cache: new _Cache2.default({ stdTTL: _constants.ONE_WEEK })
});

exports.default = db;