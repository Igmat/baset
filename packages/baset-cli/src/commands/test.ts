import { test } from 'baset-core';
import * as glob from 'glob-promise';
import { CommandModule } from 'yargs';

const errMessage = (err: { name: string; expected: string; actual: string }) => `Expected for ${err.name}:
${err.expected}
Actual:
${err.actual}`;

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
    handler: async argv => {
        let isSucceeded = true;
        const [specs, baselines] = await Promise.all([glob(argv.specs), glob(argv.bases)]);
        const results = await Promise.all(test(specs, baselines)
            .map(result => result
                .catch(err => {
                    isSucceeded = false;

                    return err instanceof Error
                        ? err.message
                        : errMessage(err);
                })));
        results.forEach(message => console.log(message));
        process.exit(isSucceeded ? 0 : 1);
    },
};
export = testCommand;
