import { test } from 'baset-core';
import * as glob from 'glob-promise';
import { CommandModule } from 'yargs';

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
        const [specs, baselines] = await Promise.all([glob(argv.specs), glob(argv.bases)]);
        test(specs, baselines);
    },
};
export = testCommand;
