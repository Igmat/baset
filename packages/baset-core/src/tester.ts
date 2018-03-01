import path from 'path';
import { isPrimitive } from 'util';
import { ITestGroupOptions, TestGroup } from './testGroup';
import { pathToTmp, IDictionary, isExists, readFile, unlink, writeFile, tmpToPath } from './utils';

export class Tester {
    private testGroups: TestGroup[];

    // tslint:disable-next-line:no-any
    constructor(plugins: IDictionary<ITestGroupOptions>, pluginsOptions: IDictionary<any>) {
        this.testGroups = Object.keys(plugins)
            .map(key => new TestGroup(key, plugins[key], pluginsOptions));
    }

    test(specs: string[], baselines: string[]) {
        return specs.map(this.testSpec);
    }
    accept(files: string[]) {
        return files.map(this.acceptBase);
    }

    private testSpec = async (name: string) => {
        const reader = this.testGroups.find(group => group.match(name));
        if (!reader) throw new Error(`No reader defined for ${name}!`);
        const baseline = await reader.read(name);
        const output = this.normalizeEndings(baseline.output);
        const baselineValue = await isExists(baseline.path)
            ? this.normalizeEndings(await readFile(baseline.path, { encoding: 'utf-8' }))
            : false;
        await writeFile(pathToTmp(baseline.path), output);

        return {
            name,
            isPassed: baselineValue === output,
            expected: baselineValue || '',
            actual: output,
        };
    }

    private acceptBase = async (name: string) => {
        const baseline = await readFile(path.resolve(name), { encoding: 'utf-8' });
        const filePath = tmpToPath(name);
        await writeFile(path.resolve(filePath), baseline);
        await unlink(path.resolve(name));

        return filePath;
    }

    private normalizeEndings = (value: string) =>
        value.replace(/\r?\n|\r/g, '\n').trim();
}
