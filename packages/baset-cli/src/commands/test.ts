import { Tester } from 'baset-core';
import glob from 'glob-promise';
import tapDiff from 'tap-diff';
import { CommandModule } from 'yargs';
import { IGlobalArgs } from '../options';
import { getTapStream } from '../TAP';

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
            const { tapStream, finish } = getTapStream(tester.test(specs, baselines));
            tapStream.pipe(tapDiff()).pipe(process.stdout);
            const results = await finish;
            isSucceeded = !(results.failed) && !(results.crashed);
        } catch (err) {
            isSucceeded = false;
            console.error(err);
        }
        process.exit(isSucceeded ? 0 : 1);
    },
};
export = testCommand;
