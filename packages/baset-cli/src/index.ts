import { createBaselines } from 'baset-core';
import * as glob from 'glob';
import * as path from 'path';

export function init() {
    glob('**/*.spec.js', (er, files) => {
        createBaselines(files.map(file => path.resolve(file)));
    });
}
