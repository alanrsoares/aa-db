export const uncapitalize = x => x.replace(/^\w/, y => y.toLowerCase());

export const uncapitalizeKeys = obj =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      [uncapitalize(key)]: obj[key]
    }),
    {}
  );

export const removeQueryString = uri => uri.split("?")[0];

export const randomInt = ({ min = 0, max }) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
