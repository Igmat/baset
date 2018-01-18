const { spawnSync } = require('child_process');
const path = require('path');

const testProccess = spawnSync('npm', ['test'], { cwd: path.resolve(__dirname, './sample-project'), encoding: 'ascii' });

module.exports = {
    stdout: testProccess.stdout,
    stderr: testProccess.stderr,
}
