import * as fs from 'fs';

export function test(specs: string[], baselines: string[]) {
    const files = specs.map(name => ({
        name,
        output: JSON.stringify(require(name)),
    }));
    files.forEach(file => {
        const baselinePath = file.name.replace(/.spec.js$/, '.base');
        const baseline = fs.existsSync(baselinePath)
            ? fs.readFileSync(baselinePath, { encoding: 'utf-8'})
            : false;
        fs.writeFile(
            file.name.replace(/.spec.js$/, '.base.tmp'),
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
        const baseline = fs.readFileSync(file, { encoding: 'utf-8' });
        const filePath = file.replace(/.tmp$/, '');
        fs.writeFile(
            filePath,
            baseline,
            err => console.log(err || `Baseline ${filePath} is written.`));
    });
}
