require("babel-polyfill");

const Cache = require("./Cache");
const Questions = require("./Questions");
const { ONE_WEEK } = require("./constants");

const db = new Questions({
  cache: new Cache({ stdTTL: ONE_WEEK }),
});

module.exports = db;
