import { sync } from 'find-up';
import * as fs from 'fs';
import * as yargs from 'yargs';
const configPath = sync(['.basetrc', '.basetrc.json']);
const config = configPath ? JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' })) : {};

export const cli = yargs
    .usage('$0 <command>')
    .commandDir('./commands')
    .pkgConf('baset')
    .config(config)
    .help('h')
    .alias('help', 'h')
    .epilog('Made by Igmat.');
