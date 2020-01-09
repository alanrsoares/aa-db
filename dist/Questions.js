"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _parsers = require("./parsers");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ENDPOINT_HOST = "http://www.aa.co.nz";

var QUESTIONS_ENDPOINT = ENDPOINT_HOST + "/RoadCodeQuizController/getSet";

var parseAnswers = function parseAnswers(answers) {
  var links = (0, _parsers.parseTags)("a", "g")(answers);
  var contents = links.map((0, _parsers.parseTags)("a"));
  var spans = contents.map((0, _parsers.parseTags)("span", "g"));
  var spanContent = (0, _parsers.parseTags)("span");

  return spans.reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        option = _ref2[0],
        content = _ref2[1];

    return _extends({}, acc, _defineProperty({}, spanContent(option), spanContent(content).trim()));
  }, {});
};

var parseImage = function parseImage(image) {
  return {
    uri: (0, _utils.removeQueryString)("" + ENDPOINT_HOST + (0, _parsers.parseProp)("src")(image))
  };
};

var makeKey = function makeKey(_ref3) {
  var Question = _ref3.Question,
      RoadCodePage = _ref3.RoadCodePage,
      CorrectAnswer = _ref3.CorrectAnswer;
  return Question + "/" + RoadCodePage + "/" + CorrectAnswer;
};

var refineQuestion = function refineQuestion(question) {
  return (0, _utils.uncapitalizeKeys)(_extends({}, question, {
    key: makeKey(question),
    Image: parseImage(question.Image),
    Answers: parseAnswers(question.Answers)
  }));
};

var unwrap = function unwrap(res) {
  return res.json();
};

var refine = function refine(data) {
  return Promise.resolve(data.map(refineQuestion));
};

var Questions = function () {
  function Questions(_ref4) {
    var cache = _ref4.cache,
        _ref4$endpoint = _ref4.endpoint,
        endpoint = _ref4$endpoint === undefined ? QUESTIONS_ENDPOINT : _ref4$endpoint,
        _ref4$maximumEmptyAtt = _ref4.maximumEmptyAttempts,
        maximumEmptyAttempts = _ref4$maximumEmptyAtt === undefined ? 20 : _ref4$maximumEmptyAtt;

    _classCallCheck(this, Questions);

    Object.assign(this, {
      endpoint: endpoint,
      cache: cache,
      maximumEmptyAttempts: maximumEmptyAttempts,
      emptyAttempts: 0,
      store: this.store.bind(this)
    });
  }

  _createClass(Questions, [{
    key: "random",
    value: function random() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;

      var result = [];
      var questions = this.cache.db.toJSON().map(function (x) {
        return x.value;
      });

      for (var i = 0; i < length; i++) {
        var index = (0, _utils.randomInt)({ max: questions.length - 1 });
        result.push.apply(result, _toConsumableArray(questions.splice(index, 1)));
      }

      return result;
    }
  }, {
    key: "store",
    value: function store(questions) {
      var _this = this;

      var uncachedQuestions = questions.filter(function (q) {
        return !_this.cache.get(q.key);
      });

      if (!uncachedQuestions.length) {
        this.emptyAttempts++;
        console.log("empty attempts: " + this.emptyAttempts);
      } else {
        this.emptyAttempts = 0;
        uncachedQuestions.forEach(function (q) {
          return _this.cache.set(q.key, q);
        });
        console.log("new questions cached: " + uncachedQuestions.length);
      }

      this.sync();
    }
  }, {
    key: "fetchQuestions",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var res, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _isomorphicFetch2.default)(this.endpoint);

              case 2:
                res = _context.sent;
                _context.next = 5;
                return unwrap(res);

              case 5:
                data = _context.sent;
                return _context.abrupt("return", refine(data));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchQuestions() {
        return _ref5.apply(this, arguments);
      }

      return fetchQuestions;
    }()
  }, {
    key: "sync",
    value: function sync() {
      if (this.emptyAttempts >= this.maximumEmptyAttempts) {
        console.log("operation cancelled after " + this.maximumEmptyAttempts + " empty attempts");
        return;
      }

      this.fetchQuestions().then(this.store).catch(function (e) {
        return console.error(e);
      });
    }
  }]);

  return Questions;
}();

exports.default = Questions;