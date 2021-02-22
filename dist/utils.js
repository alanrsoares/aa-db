"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var uncapitalize = function uncapitalize(x) {
  return x.replace(/^\w/, function (y) {
    return y.toLowerCase();
  });
};

var uncapitalizeKeys = function uncapitalizeKeys(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    return _extends({}, acc, _defineProperty({}, uncapitalize(key), obj[key]));
  }, {});
};

var removeQueryString = function removeQueryString(uri) {
  return uri.split("?")[0];
};

var randomInt = function randomInt(_ref) {
  var _ref$min = _ref.min,
      min = _ref$min === undefined ? 0 : _ref$min,
      max = _ref.max;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  uncapitalize: uncapitalize,
  uncapitalizeKeys: uncapitalizeKeys,
  removeQueryString: removeQueryString,
  randomInt: randomInt
};