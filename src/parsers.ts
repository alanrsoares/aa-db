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

export function parseTag(tag: string) {
  return (subject: string) => {
    const pattern = `<${tag}.*?>(.*?)<\/${tag}>`;
    const match = subject.match(new RegExp(pattern)) ?? ["", ""];

    return match[1] as string;
  };
}

export function parseTags(tag: string) {
  return (subject: string) => {
    const pattern = `<${tag}.*?>(.*?)<\/${tag}>`;
    const match = subject.match(new RegExp(pattern, global ? "g" : undefined));

    return match as string[];
  };
}
