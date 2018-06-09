import { Tester } from 'baset-core';
import glob from 'glob-promise';
import { Writable } from 'stream';
import { CommandModule } from 'yargs';
import { IGlobalArgs } from '../options';
import { getTapStream } from '../TAP';

function filterNodeModules(filePath: string) {
    return !filePath.includes('node_modules');
}

interface ITestArgs extends IGlobalArgs {
    bases: string;
    specs: string;
    reporter: string;
    isolateContext: boolean;
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
        reporter: {
            alias: 'r',
            type: 'string',
            describe: 'TAP reporter to use, `false` for plain output',
            default: 'tap-diff',
        },
        isolateContext: {
            type: 'boolean',
            describe: 'Run each test in isolated context. ATTENTION: this will slow down your tests',
            default: false,
        },
    },
    handler: async (argv: ITestArgs) => {
        let isSucceeded = true;
        const [allSpecs, allBaselines] = await Promise.all([glob(argv.specs), glob(argv.bases)]);
        const specs = allSpecs.filter(filterNodeModules);
        const baselines = allBaselines.filter(filterNodeModules);
        let reporterIsSkipped: boolean;
        try {
            reporterIsSkipped = JSON.parse(argv.reporter) === false;
        } catch (err) {
            reporterIsSkipped = !argv.reporter;
        }
        try {
            const outStream: Writable = (reporterIsSkipped)
                ? process.stdout
                : require(argv.reporter)();
            if (!reporterIsSkipped) outStream.pipe(process.stdout);

            const { finish } = getTapStream(specs.length, outStream);

            const tester = new Tester(argv.plugins, argv.options, argv.isolateContext);

            const results = await finish(() => tester.test(specs, baselines));
            isSucceeded = !(results.failed) && !(results.crashed);
        } catch (err) {
            isSucceeded = false;
            console.error(err);
        }
        process.exit(isSucceeded ? 0 : 1);
    },
};
export = testCommand;
