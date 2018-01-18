const { spawnSync } = require('child_process');
const path = require('path');

const testProccess = spawnSync('npm', ['test'], { cwd: path.resolve(__dirname, './sample-project'), encoding: 'ascii' });
const acceptProccess = spawnSync('npm', ['run', 'accept'], { cwd: path.resolve(__dirname, './sample-project'), encoding: 'ascii' });

module.exports = {
    test: {
        stdout: testProccess.stdout,
        stderr: testProccess.stderr,
    },
    accept: {
        stdout: acceptProccess.stdout,
        stderr: acceptProccess.stderr,
    }
}
