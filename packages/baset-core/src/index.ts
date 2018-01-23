import * as fs from 'fs';
import * as beautify from 'json-beautify';
import * as path from 'path';
import { isPrimitive } from 'util';

// tslint:disable-next-line:no-any
async function calculateValues(obj: any): Promise<any> {
    if (isPrimitive(obj)) return obj;
    else if (obj instanceof Promise) return obj;
    else if (obj instanceof Function) return obj();
    else if (obj instanceof Array) return await Promise.all(obj.map(calculateValues));

    return (await Promise.all(Object.keys(obj)
        .map(async key => ({ [key]: await calculateValues(obj[key]) }))))
        .reduce((result, prop) => ({ ...result, ...prop }), {});
}

async function testSpec(spec: string) {
    const file = {
        name: spec,
        output: beautify(await calculateValues(require(path.resolve(spec))), undefined, 4, 20),
    };

    return await new Promise<string>((resolve, reject) => {
        const baselinePath = path.resolve(file.name.replace(/.spec.js$/, '.base'));
        const baseline = fs.existsSync(baselinePath)
            ? fs.readFileSync(baselinePath, { encoding: 'utf-8' })
            : false;
        fs.writeFile(
            path.resolve(file.name.replace(/.spec.js$/, '.base.tmp')),
            file.output,
            err => {
                if (err) return reject(err);
                console.log(`Temp baseline for ${file.name} is written.`);
                if (baseline === file.output) {
                    resolve(`Test for ${file.name} is passed`);
                } else {
                    reject({
                        name: file.name,
                        expected: baseline || '',
                        actual: file.output,
                    });
                }
            });
    });
}

export function test(specs: string[], baselines: string[]): Promise<string>[] {
    return specs.map(testSpec);
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
