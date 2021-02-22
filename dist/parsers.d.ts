export declare const propPattern: (prop: string) => RegExp;
export declare const parseProp: (prop: string) => (subject: string) => string | null;
export declare const parseProps: (props: string[]) => (subject: string) => Record<string, string | null>;
export declare function parseTag(tag: string): (subject: string) => string;
export declare function parseTags(tag: string): (subject: string) => string[];
