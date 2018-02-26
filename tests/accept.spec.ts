import { sync as spawnSync } from 'cross-spawn';
import fs from 'fs';
import path from 'path';

export = fs.readdirSync(__dirname)
    .filter(source => fs.lstatSync(path.join(__dirname, source)).isDirectory())
    .map(project => {
        const cwd = path.resolve(__dirname, `./${project}`);
        const testProccess = spawnSync('npm', ['test'], { cwd, encoding: 'utf8' });
        const acceptProccess = spawnSync('npm', ['run', 'accept'], { cwd, encoding: 'utf8' });

        return {
            project,
            test: {
                stdout: testProccess.stdout.split('\n')
                    // we don't need to check npm tasks output (like `> baset` or `> path/to/node.exe index.js`)
                    .filter(line => !line.startsWith('>')),
                stderr: testProccess.stderr.split('\n')
                    // we don't need to check npm warn about node version used in script
                    .filter(line => !line.search('`--scripts-prepend-node-path`')),
            },
            accept: {
                stdout: acceptProccess.stdout.split('\n')
                    // we don't need to check npm tasks output (like `> baset` or `> path/to/node.exe index.js`)
                    .filter(line => !line.startsWith('>')),
                stderr: acceptProccess.stderr.split('\n')
                    // we don't need to check npm warn about node version used in script
                    .filter(line => !line.search('`--scripts-prepend-node-path`')),
            },
        };
    });
