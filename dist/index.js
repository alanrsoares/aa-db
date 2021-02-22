"use strict";

require("babel-polyfill");

var Cache = require("./Cache");
var Questions = require("./Questions");

var _require = require("./constants"),
    ONE_WEEK = _require.ONE_WEEK;

var db = new Questions({
  cache: new Cache({ stdTTL: ONE_WEEK })
});

module.exports = db;