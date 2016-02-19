const propPattern = prop => new RegExp(`${prop}=(["'])(.*?)\\1`)

export const parseProp = prop => subject =>
  propPattern(prop).exec(subject)[2]

export const parseProps = props => subject =>
  props.reduce((acc, prop) => ({
    ...acc,
    [prop]: parseProp(prop)(subject)
  }), {})

export const parseTags = (tag, opts) => subject => opts
  ? subject.match(new RegExp(`<${tag}.*?>(.*?)<\/${tag}>`, opts))
  : subject.match(new RegExp(`<${tag}.*?>(.*?)<\/${tag}>`))[1]
