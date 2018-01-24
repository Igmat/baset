const path = require('path');
const fs = require('fs');

const rootReadme = path.resolve(__dirname, './../../../README.md');
const currentReadme = path.resolve(__dirname, './../README.md');
fs.writeFileSync(currentReadme, fs.readFileSync(rootReadme));
