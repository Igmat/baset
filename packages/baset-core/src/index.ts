import * as fs from 'fs';

export function createBaselines(filenames: string[]) {
    const outputs = filenames.map(filename => ({
        filename,
        output: JSON.stringify(require(filename)),
    }));
    outputs.forEach(baseline => fs.writeFile(
        baseline.filename.replace(/.spec.js$/, '.base'),
        baseline.output,
        err => console.log(err || `Baseline for ${baseline.filename} is written.`)));
}
