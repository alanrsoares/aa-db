"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Cache_1 = tslib_1.__importDefault(require("./Cache"));
var Questions_1 = tslib_1.__importDefault(require("./Questions"));
var constants_1 = require("./constants");
var db = new Questions_1.default({
    cache: new Cache_1.default({ stdTTL: constants_1.ONE_WEEK }),
});
module.exports = db;
//# sourceMappingURL=index.js.map