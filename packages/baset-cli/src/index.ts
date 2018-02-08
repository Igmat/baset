import { sync } from 'find-up';
import fs from 'fs';
import * as yargs from 'yargs';
import { options } from './options';
const configPath = sync(['.basetrc', '.basetrc.json']);
const config = configPath ? JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' })) : {};

export const cli = yargs
    .usage('$0 <command>')
    .commandDir('./commands')
    .options(options)
    .pkgConf('baset')
    .config(config)
    .help('h')
    .alias('help', 'h')
    .epilog('Made by Igmat.');
