import { test } from 'baset-core';
import * as glob from 'glob-promise';
import * as path from 'path';

export async function init() {
    const [specs, baselines] = await Promise.all([glob('**/*.spec.js'), glob('**/*.base')]);
    test(
        specs.map(spec => path.resolve(spec)),
        baselines.map(base => path.resolve(base)));
}
