const ONE_HOUR = 3600;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;
const COLLECTION_ID = "cache";
const ENDPOINT_HOST = "https://www.aa.co.nz";
const QUESTIONS_ENDPOINT = `${ENDPOINT_HOST}/RoadCodeQuizController/getSet`;

const IMAGE_PREFIX = `${ENDPOINT_HOST}/assets/motoring/rcq/qImg/`;

module.exports = {
  ONE_HOUR,
  ONE_DAY,
  ONE_WEEK,
  COLLECTION_ID,
  ENDPOINT_HOST,
  QUESTIONS_ENDPOINT,
  IMAGE_PREFIX,
};
