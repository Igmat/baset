const { sync: spawnSync } = require('cross-spawn');
const path = require('path');

const results = [
    'sample-project',
    'typescript-project',
    'dom-project',
].map(project => {
    const cwd = path.resolve(__dirname, `./${project}`);
    const testProccess = spawnSync('npm', ['test'], { cwd, encoding: 'utf8' });
    return {
        project,
        stdout: testProccess.stdout.split('\n')
            .filter((line) => !line.startsWith('>')), // we don't need to check npm tasks output (like `> baset` or `> path/to/node.exe index.js`)
        stderr: testProccess.stderr.split('\n')
            .filter((line) => !line.search('`--scripts-prepend-node-path`')), // we don't need to check npm warn about node version used in script
    }
});

module.exports = results;
