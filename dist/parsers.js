"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTags = exports.parseTag = exports.parseProps = exports.parseProp = exports.propPattern = void 0;
var tslib_1 = require("tslib");
var propPattern = function (prop) {
    return new RegExp("".concat(prop, "=([\"'])(.*?)\\1"));
};
exports.propPattern = propPattern;
var parseProp = function (prop) { return function (subject) {
    var match = (0, exports.propPattern)(prop).exec(subject);
    if (match) {
        return match[2];
    }
    return null;
}; };
exports.parseProp = parseProp;
var parseProps = function (props) { return function (subject) {
    return props.reduce(function (acc, prop) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, acc), (_a = {}, _a[prop] = (0, exports.parseProp)(prop)(subject), _a)));
    }, {});
}; };
exports.parseProps = parseProps;
function parseTag(tag) {
    return function (subject) {
        var _a;
        var pattern = "<".concat(tag, ".*?>(.*?)</").concat(tag, ">");
        var match = (_a = subject.match(new RegExp(pattern))) !== null && _a !== void 0 ? _a : ["", ""];
        return match[1];
    };
}
exports.parseTag = parseTag;
function parseTags(tag) {
    return function (subject) {
        var pattern = "<".concat(tag, ".*?>(.*?)</").concat(tag, ">");
        var match = subject.match(new RegExp(pattern, global ? "g" : undefined));
        return match;
    };
}
exports.parseTags = parseTags;
//# sourceMappingURL=parsers.js.map