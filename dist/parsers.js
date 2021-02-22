"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var propPattern = function propPattern(prop) {
  return new RegExp(prop + "=([\"'])(.*?)\\1");
};

var parseProp = function parseProp(prop) {
  return function (subject) {
    return propPattern(prop).exec(subject)[2];
  };
};

var parseProps = function parseProps(props) {
  return function (subject) {
    return props.reduce(function (acc, prop) {
      return _extends({}, acc, _defineProperty({}, prop, parseProp(prop)(subject)));
    }, {});
  };
};

var parseTags = function parseTags(tag, opts) {
  return function (subject) {
    return opts ? subject.match(new RegExp("<" + tag + ".*?>(.*?)</" + tag + ">", opts)) : subject.match(new RegExp("<" + tag + ".*?>(.*?)</" + tag + ">"))[1];
  };
};

module.exports = {
  parseProp: parseProp,
  parseProps: parseProps,
  parseTags: parseTags
};