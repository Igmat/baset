import * as fs from 'fs';
import * as path from 'path';
import { isPrimitive, promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const isExists = promisify(fs.exists);
const unlink = promisify(fs.unlink);

export interface IDictionary<T> {
    [index: string]: T;
}

export class Tester {
    private readers: {
        pattern: RegExp;
        read(filePath: string): Promise<string>;
    }[];

    // tslint:disable-next-line:no-any
    constructor(readers: IDictionary<string[]>, pluginsOptions: IDictionary<any>) {
        this.readers = this.initPlugins(readers, pluginsOptions);
    }

    test(specs: string[], baselines: string[]) {
        return specs.map(this.testSpec);
    }
    accept(files: string[]) {
        return files.map(this.acceptBase);
    }

    private testSpec = async (name: string) => {
        const reader = this.readers.find(({ pattern }) => pattern.test(name));
        if (!reader) throw new Error(`No reader defined for ${name}!`);
        const output = await reader.read(name);
        const ext = path.extname(name);
        const baselinePath = path.resolve(name.replace(new RegExp(`${ext}$`), '.base'));
        const baselineValue = await isExists(baselinePath)
            ? await readFile(baselinePath, { encoding: 'utf-8' })
            : false;
        await writeFile(path.resolve(`${baselinePath}.tmp`), output);

        return {
            name,
            isPassed: baselineValue === output,
            expected: baselineValue || '',
            actual: output,
        };
    }

    private acceptBase = async (name: string) => {
        const baseline = await readFile(path.resolve(name), { encoding: 'utf-8' });
        const filePath = name.replace(/.tmp$/, '');
        await writeFile(path.resolve(filePath), baseline);
        await unlink(path.resolve(name));

        return filePath;
    }

    // tslint:disable-next-line:no-any
    private initPlugins = (plugins: IDictionary<string[]>, pluginsOptions: IDictionary<any>) =>
        Object.keys(plugins).map(key => {
            const chain = plugins[key].map(plugin => new (require(path.resolve(plugin)).default)(pluginsOptions[plugin]));

            return {
                pattern: new RegExp(key),
                read: (filePath: string) => chain.reduce((result, plugin) => plugin.read(filePath, result), ''),
            };
        })
}
