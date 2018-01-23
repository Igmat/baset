const { sync: spawnSync } = require('cross-spawn');
const path = require('path');

const testProccess = spawnSync('npm', ['test'], { cwd: path.resolve(__dirname, './sample-project'), encoding: 'ascii' });

module.exports = {
    stdout: testProccess.stdout.split('\n')
        .filter((line) => !line.startsWith('>')), // we don't need to check npm tasks output (like `> baset` or `> path/to/node.exe index.js`)
    stderr: testProccess.stderr.split('\n')
        .filter((line) => !line.search('`--scripts-prepend-node-path`')), // we don't need to check npm warn about node version used in script
}
