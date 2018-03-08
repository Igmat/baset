import { sync as spawnSync } from 'cross-spawn';
import fs from 'fs';
import path from 'path';

const cwd = path.resolve(__dirname, './scaffolded-project');
const scaffoldProccess = spawnSync('npm', ['run', 'scaffold'], { cwd, encoding: 'utf8' });
export = {
    stdout: scaffoldProccess.stdout.split('\n')
        // we don't need to check npm tasks output (like `> baset` or `> path/to/node.exe index.js`)
        .filter(line => !line.startsWith('>')),
    stderr: scaffoldProccess.stderr.split('\n')
        // we don't need to check npm warn about node version used in script
        .filter(line => !line.search('`--scripts-prepend-node-path`')),
};

/// Clean-up file system
['someClass.spec.ts', 'index.spec.ts']
    .map(file => path.resolve(cwd, file))
    .forEach(fs.unlinkSync);
