"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetch = require("isomorphic-fetch");
var fs = require("fs");
var db = require("../db/db.json");

var _require = require("./constants"),
    IMAGE_PREFIX = _require.IMAGE_PREFIX;

var ROOT_DIR = __dirname + "/..";
var ASSETS_DIR = ROOT_DIR + "/db/assets";

var IMG_URLS = db.cache.map(function (item) {
  return item.value.image.uri;
});

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

try {
  var downloads = IMG_URLS.map(function (url) {
    return downloadFromUrl(url);
  });
  fs.mkdir(ASSETS_DIR, function () {
    console.log("Downloading assets");
    Promise.all(downloads).then(function () {
      console.log("Finished downloading assets!");
    });
  });
} catch (e) {
  console.log("Failed to sync assets:", e);
}