import { Scaffolder, utils } from 'baset-core';
import glob from 'glob-promise';
import { CommandModule } from 'yargs';
import { IGlobalArgs } from '../options';

interface IAcceptArgs extends IGlobalArgs {
    files: string;
    specs: string;
}

function complementArray<T>(arrayA: T[], arrayB: T[]) {
    arrayA.forEach(match => {
        const index = arrayB.indexOf(match);

        if (index > -1) {
            arrayB.splice(index, 1);
        }
    });
}

const scaffoldCommand: CommandModule = {
    command: ['scaffold'],
    aliases: ['s'],
    describe: 'Scaffolding new spec',
    builder: {
        files: {
            alias: 'f',
            type: 'string',
            describe: 'Glob pattern for project files',
            default: '**/*.js',
        },
        specs: {
            alias: 's',
            type: 'string',
            describe: 'Glob pattern for spec files',
            default: '**/*.spec.js',
        },
    },
    handler: async (argv: IAcceptArgs) => {
        const files = await glob(argv.files);
        const specs = await glob(argv.specs);
        complementArray(specs, files);
        const scaffolder = new Scaffolder();
        const results = await Promise.all(scaffolder.scaffold(files));
        results.forEach(result => result && console.log(`Spec "${result}" is scaffolded`));
    },
};
export = scaffoldCommand;
