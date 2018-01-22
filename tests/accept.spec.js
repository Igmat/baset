const { spawnSync } = require('child_process');
const path = require('path');

const testProccess = spawnSync('npm', ['test'], { cwd: path.resolve(__dirname, './sample-project'), encoding: 'ascii' });
const acceptProccess = spawnSync('npm', ['run', 'accept'], { cwd: path.resolve(__dirname, './sample-project'), encoding: 'ascii' });

module.exports = {
    test: {
        stdout: testProccess.stdout.split('\n')
            .filter((line) => !line.startsWith('>')), // we don't need to check npm tasks output (like `> baset` or `> path/to/node.exe index.js`)
        stderr: testProccess.stderr.split('\n')
            .filter((line) => !line.search('`--scripts-prepend-node-path`')), // we don't need to check npm warn about node version used in script
    },
    accept: {
        stdout: acceptProccess.stdout.split('\n')
            .filter((line) => !line.startsWith('>')), // we don't need to check npm tasks output (like `> baset` or `> path/to/node.exe index.js`)
        stderr: acceptProccess.stderr.split('\n')
            .filter((line) => !line.search('`--scripts-prepend-node-path`')), // we don't need to check npm warn about node version used in script
    }
}
