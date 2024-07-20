export abstract class CustomApiError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);
    }
}
