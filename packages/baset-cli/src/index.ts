import * as yargs from 'yargs';

export const cli = yargs
    .usage('$0 <command>')
    .commandDir('./commands')
    .help('h')
    .alias('help', 'h')
    .epilog('Made by Igmat.');
