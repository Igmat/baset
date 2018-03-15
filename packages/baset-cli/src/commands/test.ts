import { Tester } from 'baset-core';
import glob from 'glob-promise';
import { CommandModule } from 'yargs';
import { IGlobalArgs } from '../options';

const errMessage = (err: { name: string; expected: string; actual: string }) => `Temp baseline for ${err.name} is written.
Expected for ${err.name}:
${err.expected}
Actual:
${err.actual}`;
const successMessage = (err: { name: string; expected: string; actual: string }) => `Temp baseline for ${err.name} is written.
Test for ${err.name} is passed`;

function filterNodeModules(filePath: string) {
    return !filePath.includes('node_modules');
}

interface ITestArgs extends IGlobalArgs {
    bases: string;
    specs: string;
}

const testCommand: CommandModule = {
    command: 'test',
    aliases: ['$0', 't'],
    describe: 'Creating temp baseline and comparing it to existing one',
    builder: {
        specs: {
            alias: 's',
            type: 'string',
            describe: 'Glob pattern for spec files',
            default: '**/*.spec.js',
        },
        bases: {
            alias: 'b',
            type: 'string',
            describe: 'Glob pattern for baseline files',
            default: '**/*.base',
        },
    },
    handler: async (argv: ITestArgs) => {
        let isSucceeded = true;
        const [allSpecs, allBaselines] = await Promise.all([glob(argv.specs), glob(argv.bases)]);
        const tester = new Tester(argv.plugins, argv.options);
        const specs = allSpecs.filter(filterNodeModules);
        const baselines = allBaselines.filter(filterNodeModules);
        try {
            const results = await Promise.all(tester.test(specs, baselines));
            isSucceeded = results.every(result => result.isPassed);
            results.forEach(result => (result.isPassed)
                ? console.log(successMessage(result))
                : console.log(errMessage(result)));
        } catch (err) {
            isSucceeded = false;
            console.log(err);
        }
        process.exit(isSucceeded ? 0 : 1);
    },
};
export = testCommand;
