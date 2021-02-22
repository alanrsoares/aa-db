export const propPattern = (prop: string) =>
  new RegExp(`${prop}=(["'])(.*?)\\1`);

export const parseProp = (prop: string) => (subject: string) => {
  const match = propPattern(prop).exec(subject);
  if (match) {
    return match[2];
  }
  return null;
};

export const parseProps = (props: string[]) => (subject: string) =>
  props.reduce<Record<string, string | null>>(
    (acc, prop) => ({
      ...acc,
      [prop]: parseProp(prop)(subject),
    }),
    {}
  );

export const parseTags = (tag: string, opts?: string) => (subject: string) => {
  const pattern = `<${tag}.*?>(.*?)<\/${tag}>`;

  return (opts
    ? subject.match(new RegExp(pattern, opts))
    : (subject.match(new RegExp(pattern)) ?? [])[1]) as string[];
};
