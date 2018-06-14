/**
 * VMError.
 *
 * @class
 * @extends {Error}
 * @property {String} stack Call stack.
 * @property {String} message Error message.
 */
export class VMError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'VMError';
        Error.captureStackTrace(this, this.constructor);
    }
}
