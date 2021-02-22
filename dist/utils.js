"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInt = exports.removeQueryString = exports.uncapitalizeKeys = exports.uncapitalize = void 0;
var tslib_1 = require("tslib");
var uncapitalize = function (x) {
    return x.replace(/^\w/, function (y) { return y.toLowerCase(); });
};
exports.uncapitalize = uncapitalize;
var uncapitalizeKeys = function (obj) {
    return Object.keys(obj).reduce(function (acc, key) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, acc), (_a = {}, _a[exports.uncapitalize(key)] = obj[key], _a)));
    }, {});
};
exports.uncapitalizeKeys = uncapitalizeKeys;
var removeQueryString = function (uri) { return uri.split("?")[0]; };
exports.removeQueryString = removeQueryString;
var randomInt = function (_a) {
    var _b = _a.min, min = _b === void 0 ? 0 : _b, max = _a.max;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.randomInt = randomInt;
//# sourceMappingURL=utils.js.map