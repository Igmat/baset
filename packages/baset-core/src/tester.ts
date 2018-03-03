import path from 'path';
import { isPrimitive } from 'util';
import { ITestGroupOptions, TestGroup } from './testGroup';
import { IDictionary, isExists, pathToTmp, readFile, tmpToPath, unlink, writeFile } from './utils';

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
        const testResult = await reader.test(name);
        await writeFile(pathToTmp(testResult.path), testResult.output.actual);

        return {
            name,
            isPassed: testResult.output.isEqual,
            expected: testResult.output.expected || '',
            actual: testResult.output.actual,
        };
    }

    private acceptBase = async (name: string) => {
        const baseline = await readFile(path.resolve(name), { encoding: 'utf-8' });
        const filePath = tmpToPath(name);
        await writeFile(path.resolve(filePath), baseline);
        await unlink(path.resolve(name));

        return filePath;
    }
}
