"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTags = exports.parseProps = exports.parseProp = exports.propPattern = void 0;
var tslib_1 = require("tslib");
var propPattern = function (prop) {
    return new RegExp(prop + "=([\"'])(.*?)\\1");
};
exports.propPattern = propPattern;
var parseProp = function (prop) { return function (subject) {
    var match = exports.propPattern(prop).exec(subject);
    if (match) {
        return match[2];
    }
    return null;
}; };
exports.parseProp = parseProp;
var parseProps = function (props) { return function (subject) {
    return props.reduce(function (acc, prop) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, acc), (_a = {}, _a[prop] = exports.parseProp(prop)(subject), _a)));
    }, {});
}; };
exports.parseProps = parseProps;
var parseTags = function (tag, opts) { return function (subject) {
    var _a;
    var pattern = "<" + tag + ".*?>(.*?)</" + tag + ">";
    return (opts
        ? subject.match(new RegExp(pattern, opts))
        : ((_a = subject.match(new RegExp(pattern))) !== null && _a !== void 0 ? _a : [])[1]);
}; };
exports.parseTags = parseTags;
//# sourceMappingURL=parsers.js.map