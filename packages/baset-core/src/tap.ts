import { TestError } from './testError';

export interface ITestOptions {
    index: number;
    comment?: string | string[];
}
export interface IPassedTestOptions extends ITestOptions {
    passed: true;
    skip: boolean;
}
export type PassedTestOptions = IPassedTestOptions;
export interface IFailedTestOptions extends ITestOptions {
    passed: false;
}
export interface IErrorTestOptions extends IFailedTestOptions {
    error: TestError;
    todo?: false;
}
export interface ITodoTestOptions extends IFailedTestOptions {
    todo: true;
}
export type FailedTestOptions = IErrorTestOptions | ITodoTestOptions;
export type Options = PassedTestOptions | FailedTestOptions;
export interface IStats {
    passed: number;
    failed: number;
    skipped: number;
    todo: number;
    crashed: number;
}
