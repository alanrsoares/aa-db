"use strict";

var ONE_HOUR = 3600;
var ONE_DAY = 24 * ONE_HOUR;
var ONE_WEEK = 7 * ONE_DAY;
var COLLECTION_ID = "cache";
var ENDPOINT_HOST = "https://www.aa.co.nz";
var QUESTIONS_ENDPOINT = ENDPOINT_HOST + "/RoadCodeQuizController/getSet";

var IMAGE_PREFIX = ENDPOINT_HOST + "/assets/motoring/rcq/qImg/";

module.exports = {
  ONE_HOUR: ONE_HOUR,
  ONE_DAY: ONE_DAY,
  ONE_WEEK: ONE_WEEK,
  COLLECTION_ID: COLLECTION_ID,
  ENDPOINT_HOST: ENDPOINT_HOST,
  QUESTIONS_ENDPOINT: QUESTIONS_ENDPOINT,
  IMAGE_PREFIX: IMAGE_PREFIX
};