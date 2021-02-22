export const uncapitalize = (x: string) =>
  x.replace(/^\w/, (y) => y.toLowerCase());

export const uncapitalizeKeys = (obj: Record<string, string | {}>) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      [uncapitalize(key)]: obj[key],
    }),
    {}
  );

export const removeQueryString = (uri: string) => uri.split("?")[0];

export const randomInt = ({ min = 0, max }: { min?: number; max: number }) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
