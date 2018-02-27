import { sampleFn } from './index';

export = {
    values: [
        sampleFn(1, 1),
        sampleFn(1000000, 1000000),
        sampleFn('abc', 'cba'),
        sampleFn(1, 'abc'),
        sampleFn('abc', 1),
        () => sampleFn('function call', 1),
        new Promise(resolve => resolve(sampleFn('async value', 1))),
    ],
};
