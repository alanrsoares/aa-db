'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _parser = require('./parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var parseAnswers = function parseAnswers(answers) {
  var links = (0, _parser.parseTags)('a', 'g')(answers);
  var contents = links.map((0, _parser.parseTags)('a'));
  var spans = contents.map((0, _parser.parseTags)('span', 'g'));
  var spanContent = (0, _parser.parseTags)('span');

  return spans.reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var option = _ref2[0];
    var content = _ref2[1];
    return _extends({}, acc, _defineProperty({}, spanContent(option), spanContent(content).trim()));
  }, {});
};

var unwrap = function unwrap(res) {
  return res.json();
};

var refineQuestion = function refineQuestion(question) {
  return _extends({}, question, {
    key: question.Question,
    Image: (0, _parser.parseProps)(['src', 'alt'])(question.Image),
    Answers: parseAnswers(question.Answers)
  });
};

var refine = function refine(data) {
  return Promise.resolve(data.map(refineQuestion));
};

var Questions = (function () {
  function Questions(_ref3) {
    var endpoint = _ref3.endpoint;
    var cache = _ref3.cache;
    var _ref3$maximumEmptyAtt = _ref3.maximumEmptyAttempts;
    var maximumEmptyAttempts = _ref3$maximumEmptyAtt === undefined ? 10 : _ref3$maximumEmptyAtt;

    _classCallCheck(this, Questions);

    Object.assign(this, {
      endpoint: endpoint,
      cache: cache,
      maximumEmptyAttempts: maximumEmptyAttempts,
      store: this.store.bind(this),
      emptyAttempts: 0
    });
  }

  _createClass(Questions, [{
    key: 'store',
    value: function store(questions) {
      var _this = this;

      var newQuestions = questions.filter(function (q) {
        return !_this.cache.get(q.key);
      });

      if (!newQuestions.length) {
        this.emptyAttempts++;
        console.log('empty attempts: ' + this.emptyAttempts);
      } else {
        this.emptyAttempts = 0;
        newQuestions.forEach(function (q) {
          return _this.cache.set(q.key, q);
        });
        console.log('new questions cached: ' + newQuestions.length);
      }

      this.fetchQuestions();
    }
  }, {
    key: 'fetchQuestions',
    value: function fetchQuestions() {
      var _context;

      if (this.emptyAttempts >= this.maximumEmptyAttempts) {
        console.log('operation cancelled after ' + this.maximumEmptyAttempts + ' empty attempts');
        return;
      }

      (0, _isomorphicFetch2.default)(this.endpoint).then(unwrap).then(refine).then(this.store).catch((_context = console).log.bind(_context));
    }
  }]);

  return Questions;
})();

exports.default = Questions;