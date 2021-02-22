"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var fs_1 = tslib_1.__importDefault(require("fs"));
var constants_1 = require("./constants");
var ROOT_DIR = __dirname + "/..";
var ASSETS_DIR = ROOT_DIR + "/db/assets";
function downloadFromUrl(url, verbose) {
    var _this = this;
    if (url === void 0) { url = ""; }
    if (verbose === void 0) { verbose = false; }
    return new Promise(function (resolve) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var response, buffer, fileName;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1.default(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.buffer()];
                case 2:
                    buffer = _a.sent();
                    fileName = url.replace(constants_1.IMAGE_PREFIX, "");
                    fs_1.default.writeFile(ASSETS_DIR + "/" + fileName, buffer, function () {
                        if (verbose) {
                            console.log("Downloaded: " + fileName);
                        }
                        resolve("" + fileName);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}
function syncAssets(items) {
    if (items === void 0) { items = []; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var IMG_URLS;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            IMG_URLS = items.map(function (item) { return item.value.image.uri; });
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    try {
                        var downloads_1 = IMG_URLS.map(function (url) {
                            return downloadFromUrl(constants_1.IMAGE_PREFIX + "/" + url);
                        });
                        fs_1.default.mkdir(ASSETS_DIR, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("Downloading assets");
                                        return [4 /*yield*/, Promise.all(downloads_1)];
                                    case 1:
                                        _a.sent();
                                        console.log("Finished downloading assets!");
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        resolve();
                    }
                    catch (e) {
                        console.log("Failed to sync assets:", e);
                        reject(e);
                    }
                })];
        });
    });
}
exports.default = syncAssets;
module.exports = syncAssets;
//# sourceMappingURL=syncAssets.js.map