"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeQueryString = exports.uncapitalizeKeys = exports.uncapitalize = void 0;
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
//# sourceMappingURL=utils.js.map