"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var Cache_1 = tslib_1.__importDefault(require("./Cache"));
var constants_1 = require("./constants");
var parsers_1 = require("./parsers");
var utils_1 = require("./utils");
var QUESTIONS_ENDPOINT = constants_1.ENDPOINT_HOST + "/RoadCodeQuizController/getSet";
/**
 *
 * @param {string} answers
 * @returns {Record<string,string>} parsed
 */
function parseAnswers(answers) {
    if (answers === void 0) { answers = ""; }
    var links = parsers_1.parseTags("a")(answers);
    var contents = links.map(parsers_1.parseTag("a"));
    var spans = contents.map(parsers_1.parseTags("span"));
    var spanContent = parsers_1.parseTag("span");
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
 * @param {QuestionDTO} data
 */
var makeKey = function (data) {
    return data.Question + "/" + data.RoadCodePage + "/" + data.CorrectAnswer;
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
var refine = function (data) {
    return Promise.resolve(data.map(refineQuestion));
};
var Questions = /** @class */ (function () {
    function Questions(_a) {
        var _this = this;
        var cache = _a.cache, _b = _a.endpoint, endpoint = _b === void 0 ? QUESTIONS_ENDPOINT : _b, _c = _a.maximumEmptyAttempts, maximumEmptyAttempts = _c === void 0 ? 20 : _c;
        this.store = function (questions) {
            var uncachedQuestions = questions.filter(function (q) { return !_this.cache.get(q.key); });
            clearLine();
            if (!uncachedQuestions.length) {
                _this.emptyAttempts++;
            }
            else {
                _this.emptyAttempts = 0;
                uncachedQuestions.forEach(function (q) { return _this.cache.set(q.key, q); });
            }
            process.stdout.write("New questions cached: " + chalk_1.default.bold.green(uncachedQuestions.length) + ". Total: " + chalk_1.default.bold.cyan(_this.cache.length) + ".");
            if (_this.emptyAttempts) {
                clearLine();
                process.stdout.write("Empty attempt: " + chalk_1.default.bold.red(_this.emptyAttempts + "/" + _this.maximumEmptyAttempts) + ".");
            }
        };
        this.fetchQuestions = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var res, questions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(this.endpoint)];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, unwrap(res)];
                    case 2:
                        questions = (_a.sent());
                        return [2 /*return*/, refine(questions)];
                }
            });
        }); };
        this.sync = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var error_1, cached;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.emptyAttempts !== this.maximumEmptyAttempts)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fetchQuestions().then(this.store)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        {
                            console.error(error_1);
                            return [2 /*return*/, Promise.reject(error_1)];
                        }
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 0];
                    case 5:
                        clearLine();
                        console.log("Operation cancelled after " + chalk_1.default.bold.red(this.maximumEmptyAttempts) + " empty attempts.", "Total questions cached: " + chalk_1.default.bold.cyan(this.cache.length) + ".");
                        cached = this.cache.collection.value();
                        return [2 /*return*/, cached];
                }
            });
        }); };
        if (!(cache instanceof Cache_1.default)) {
            throw new Error("Invalid argument 'cache'");
        }
        this.cache = cache;
        this.endpoint = endpoint;
        this.maximumEmptyAttempts = maximumEmptyAttempts;
        this.emptyAttempts = 0;
    }
    return Questions;
}());
exports.default = Questions;
//# sourceMappingURL=Questions.js.map