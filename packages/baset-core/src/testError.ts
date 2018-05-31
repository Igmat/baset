export class TestError extends Error {
    constructor(public data: { actual: string; expected: string }, message = "actual doesn't match expected") {
        super(message);
    }
}
