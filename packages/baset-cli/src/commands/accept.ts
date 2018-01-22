import { accept } from 'baset-core';
import * as glob from 'glob-promise';
import { CommandModule } from 'yargs';

const acceptCommand: CommandModule = {
    command: ['accept'],
    aliases: ['a'],
    describe: 'Accepting new baseline',
    builder: {
        bases: {
            alias: 'b',
            type: 'string',
            describe: 'Glob pattern for baseline files',
            default: '**/*.base',
        },
    },
    handler: async argv => {
        const baselines = await glob(argv.bases + '.tmp');
        accept(baselines);
    },
};
export = acceptCommand;
