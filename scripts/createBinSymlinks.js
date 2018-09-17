const fs = require('fs');
const path = require('path');
const utils = require('util');
const resolve = require('@lerna/resolve-symlink');
const symlink = require('@lerna/create-symlink');

const ls = utils.promisify(fs.readdir);
const lstat = utils.promisify(fs.lstat);
async function isExists(filename) {
    try {
        const stats = await lstat(filename);
        return stats.isSymbolicLink() || stats.isFile();
    } catch (err) {
        return false;
    }
}

const binFolder = './node_modules/.bin/';
const packagesFolder = './packages';

async function createBinSymlinks() {
    const binaries = (await ls(binFolder))
        .filter(binary => !/\.cmd$/.test(binary))
        .map(binary => ({
            name: binary,
            path: path.resolve(binFolder, binary)
        }));
    const packages = (await ls(packagesFolder))
        .map(package => path.resolve(packagesFolder, package))
        .filter(package => fs.statSync(package).isDirectory());
    return Promise.all(packages.map(package =>
        Promise.all(binaries.map(async (binary) => {
            const symlinkPath = path.resolve(package, binFolder, binary.name);
            if (await isExists(symlinkPath)) return;
            return symlink(resolve(binary.path), symlinkPath, 'exec');
        }))));
}

createBinSymlinks();
