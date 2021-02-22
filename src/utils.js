const uncapitalize = (x) => x.replace(/^\w/, (y) => y.toLowerCase());

const uncapitalizeKeys = (obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      [uncapitalize(key)]: obj[key],
    }),
    {}
  );

const removeQueryString = (uri) => uri.split("?")[0];

const randomInt = ({ min = 0, max }) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = {
  uncapitalize,
  uncapitalizeKeys,
  removeQueryString,
  randomInt,
};
