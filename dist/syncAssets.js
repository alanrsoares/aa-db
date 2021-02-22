"use strict";

var syncAssets = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var _this2 = this;

    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var IMG_URLS;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            IMG_URLS = items.map(function (item) {
              return item.value.image.uri;
            });
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              try {
                var downloads = IMG_URLS.map(function (url) {
                  return downloadFromUrl(IMAGE_PREFIX + "/" + url);
                });
                fs.mkdir(ASSETS_DIR, _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          console.log("Downloading assets");
                          _context2.next = 3;
                          return Promise.all(downloads);

                        case 3:
                          console.log("Finished downloading assets!");

                        case 4:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this2);
                })));
                resolve();
              } catch (e) {
                console.log("Failed to sync assets:", e);
                reject(e);
              }
            }));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function syncAssets() {
    return _ref2.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetch = require("isomorphic-fetch");
var fs = require("fs");

var _require = require("./constants"),
    IMAGE_PREFIX = _require.IMAGE_PREFIX;

var ROOT_DIR = __dirname + "/..";
var ASSETS_DIR = ROOT_DIR + "/db/assets";

function downloadFromUrl() {
  var _this = this;

  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return new Promise(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve) {
      var response, buffer, fileName;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch(url);

            case 2:
              response = _context.sent;
              _context.next = 5;
              return response.buffer();

            case 5:
              buffer = _context.sent;
              fileName = url.replace(IMAGE_PREFIX, "");


              fs.writeFile(ASSETS_DIR + "/" + fileName, buffer, function () {
                if (verbose) {
                  console.log("Downloaded: " + fileName);
                }
                resolve("" + fileName);
              });

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x3) {
      return _ref.apply(this, arguments);
    };
  }());
}

module.exports = syncAssets;