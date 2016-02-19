'use strict';

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var _Questions = require('./Questions');

var _Questions2 = _interopRequireDefault(_Questions);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var q = new _Questions2.default({
  endpoint: _constants.QUESTIONS_ENDPOINT,
  cache: _cache2.default
});

q.fetchQuestions();