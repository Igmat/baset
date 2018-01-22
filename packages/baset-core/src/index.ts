import * as fs from 'fs';
import * as beautify from 'json-beautify';
import * as path from 'path';

export function test(specs: string[], baselines: string[]) {
    const files = specs.map(name => ({
        name,
        output: beautify(require(path.resolve(name)), undefined, 4, 20),
    }));
    files.forEach(file => {
        const baselinePath = path.resolve(file.name.replace(/.spec.js$/, '.base'));
        const baseline = fs.existsSync(baselinePath)
            ? fs.readFileSync(baselinePath, { encoding: 'utf-8'})
            : false;
        fs.writeFile(
            path.resolve(file.name.replace(/.spec.js$/, '.base.tmp')),
            file.output,
            err => {
                if (err) return console.log(err);
                console.log(`Temp baseline for ${file.name} is written.`);
                if (!baseline) return;
                console.log((baseline === file.output)
                    ? 'Test passed'
                    : 'Test failed');
            });
    });
}

export function accept(files: string[]) {
    files.forEach(file => {
        const baseline = fs.readFileSync(path.resolve(file), { encoding: 'utf-8' });
        const filePath = file.replace(/.tmp$/, '');
        fs.writeFile(
            path.resolve(filePath),
            baseline,
            err => {
                console.log(err || `Baseline ${filePath} is written.`);
                fs.unlinkSync(path.resolve(file));
            });
    });
}
