import { Tester, utils } from 'baset-core';
import glob from 'glob-promise';
import { CommandModule } from 'yargs';
import { IGlobalArgs } from '../options';

interface IAcceptArgs extends IGlobalArgs {
    bases: string;
}

const acceptCommand: CommandModule<{}, IAcceptArgs> = {
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
        const baselines = await glob(utils.pathToTmp(argv.bases));
        const tester = new Tester(argv.plugins, argv.options);
        const results = await Promise.all(tester.accept(baselines));
        results.forEach(result => console.log(`Baseline ${result} is written.`));
        process.exit(0);
    },
};
export = acceptCommand;
