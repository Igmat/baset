const fs = require('fs');

fs.writeFileSync('./README.md', fs.readFileSync('./../../README.md'));
