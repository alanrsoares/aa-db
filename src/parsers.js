const propPattern = (prop) => new RegExp(`${prop}=(["'])(.*?)\\1`);

const parseProp = (prop) => (subject) => propPattern(prop).exec(subject)[2];

const parseProps = (props) => (subject) =>
  props.reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: parseProp(prop)(subject),
    }),
    {}
  );

const parseTags = (tag, opts) => (subject) =>
  opts
    ? subject.match(new RegExp(`<${tag}.*?>(.*?)<\/${tag}>`, opts))
    : subject.match(new RegExp(`<${tag}.*?>(.*?)<\/${tag}>`))[1];

module.exports = {
  parseProp,
  parseProps,
  parseTags,
};
