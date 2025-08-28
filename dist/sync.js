"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var _1 = tslib_1.__importDefault(require("."));
var syncAssets_1 = tslib_1.__importDefault(require("./syncAssets"));
_1.default.sync()
    .then(syncAssets_1.default)
    .catch(function (e) {
    console.log(chalk_1.default.bold.red(e.message));
    process.exit(1);
});
//# sourceMappingURL=sync.js.map