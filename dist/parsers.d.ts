export declare const propPattern: (prop: string) => RegExp;
export declare const parseProp: (prop: string) => (subject: string) => string | null;
export declare const parseProps: (props: string[]) => (subject: string) => Record<string, string | null>;
export declare const parseTags: (tag: string, opts?: string | undefined) => (subject: string) => string[];
