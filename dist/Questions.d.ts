export default class Questions {
    constructor({ cache, endpoint, maximumEmptyAttempts, }: {
        cache: any;
        endpoint?: string | undefined;
        maximumEmptyAttempts?: number | undefined;
    });
    random(length?: number): any[];
    store(questions?: any[]): void;
    emptyAttempts: number | undefined;
    fetchQuestions(): Promise<{}[]>;
    sync(): Promise<any>;
}
