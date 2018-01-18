const { spawnSync } = require('child_process');
const path = require('path');

const testProccess = spawnSync('npm', ['run', 'accept'], { cwd: path.resolve(__dirname, './sample-project'), encoding: 'ascii' });

module.exports = {
    stdout: testProccess.stdout,
    stderr: testProccess.stderr,
}
