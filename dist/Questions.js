"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var Cache_1 = tslib_1.__importDefault(require("./Cache"));
var constants_1 = require("./constants");
var parsers_1 = require("./parsers");
var syncAssets_1 = tslib_1.__importDefault(require("./syncAssets"));
var utils_1 = require("./utils");
var QUESTIONS_ENDPOINT = constants_1.ENDPOINT_HOST + "/RoadCodeQuizController/getSet";
/**
 *
 * @param {string} answers
 * @returns {Record<string,string>} parsed
 */
function parseAnswers(answers) {
    if (answers === void 0) { answers = ""; }
    var links = parsers_1.parseTags("a", "g")(answers);
    var contents = links.map(parsers_1.parseTags("a"));
    var spans = contents.map(parsers_1.parseTags("span", "g"));
    var spanContent = parsers_1.parseTags("span");
    return spans.reduce(function (acc, _a) {
        var _b;
        var option = _a[0], content = _a[1];
        return (tslib_1.__assign(tslib_1.__assign({}, acc), (_b = {}, _b[spanContent(option)] = spanContent(content).trim(), _b)));
    }, {});
}
function parseImage(image) {
    if (image === void 0) { image = ""; }
    var uri = utils_1.removeQueryString("" + constants_1.ENDPOINT_HOST + parsers_1.parseProp("src")(image)).replace(constants_1.IMAGE_PREFIX, "");
    return { uri: uri };
}
/**
 *
 * @param {{ Question: string; RoadCodePage: string: CorrectAnswer: string; }} data
 */
var makeKey = function (_a) {
    var Question = _a.Question, RoadCodePage = _a.RoadCodePage, CorrectAnswer = _a.CorrectAnswer;
    return Question + "/" + RoadCodePage + "/" + CorrectAnswer;
};
function clearLine() {
    process.stdout.clearLine(-1);
    process.stdout.cursorTo(0);
}
/**
 *
 * @param {{ Image: string, Answers: string }} question
 */
var refineQuestion = function (question) {
    if (question === void 0) { question = {}; }
    return utils_1.uncapitalizeKeys(tslib_1.__assign(tslib_1.__assign({}, question), { key: makeKey(question), Image: parseImage(question.Image), Answers: parseAnswers(question.Answers) }));
};
/**
 * unwrap
 *
 * @param {Response} res
 */
var unwrap = function (res) { return res.json(); };
/**
 * refine
 *
 * @param {Record<string,string>[]} data
 */
var refine = function (data) { return Promise.resolve(data.map(refineQuestion)); };
var Questions = /** @class */ (function () {
    function Questions(_a) {
        var cache = _a.cache, _b = _a.endpoint, endpoint = _b === void 0 ? QUESTIONS_ENDPOINT : _b, _c = _a.maximumEmptyAttempts, maximumEmptyAttempts = _c === void 0 ? 20 : _c;
        if (!(cache instanceof Cache_1.default)) {
            throw new Error("Invalid argument 'cache'");
        }
        Object.assign(this, {
            endpoint: endpoint,
            cache: cache,
            maximumEmptyAttempts: maximumEmptyAttempts,
            emptyAttempts: 0,
            store: this.store.bind(this),
        });
    }
    Questions.prototype.random = function (length) {
        if (length === void 0) { length = 30; }
        var result = [];
        var questions = this.cache.db.toJSON().map(function (x) { return x.value; });
        for (var i = 0; i < length; i++) {
            var index = utils_1.randomInt({ max: questions.length - 1 });
            result.push.apply(result, questions.splice(index, 1));
        }
        return result;
    };
    Questions.prototype.store = function (questions) {
        var _this = this;
        if (questions === void 0) { questions = []; }
        var uncachedQuestions = questions.filter(function (q) { return !_this.cache.get(q.key); });
        clearLine();
        if (!uncachedQuestions.length) {
            this.emptyAttempts++;
        }
        else {
            this.emptyAttempts = 0;
            uncachedQuestions.forEach(function (q) { return _this.cache.set(q.key, q); });
        }
        process.stdout.write("New questions cached: " + chalk_1.default.bold.green(uncachedQuestions.length) + ". Total: " + chalk_1.default.bold.cyan(this.cache.length) + ".");
        if (this.emptyAttempts) {
            clearLine();
            process.stdout.write("Empty attempt: " + chalk_1.default.bold.red(this.emptyAttempts + "/" + this.maximumEmptyAttempts) + ".");
        }
        this.sync();
    };
    Questions.prototype.fetchQuestions = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(this.endpoint)];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, unwrap(res)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, refine(data)];
                }
            });
        });
    };
    Questions.prototype.sync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.emptyAttempts >= _this.maximumEmptyAttempts) {
                clearLine();
                console.log("Operation cancelled after " + chalk_1.default.bold.red(_this.maximumEmptyAttempts) + " empty attempts.");
                console.log("Total questions cached: " + chalk_1.default.bold.cyan(_this.cache.length) + ".");
                var cached = _this.cache.collection.value();
                syncAssets_1.default(cached);
                resolve(cached);
            }
            else {
                _this.fetchQuestions()
                    .then(_this.store)
                    .catch(function (e) {
                    console.error(e);
                    reject(e);
                });
            }
        });
    };
    return Questions;
}());
exports.default = Questions;
//# sourceMappingURL=Questions.js.map