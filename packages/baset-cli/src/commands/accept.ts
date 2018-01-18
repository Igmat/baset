import { accept } from 'baset-core';
import * as glob from 'glob-promise';
import * as path from 'path';
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
        accept(baselines.map(base => path.resolve(base)));
    },
};
export = acceptCommand;
