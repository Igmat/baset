import { AbstractResolver, dataTypes, utils } from 'baset-core';
import { NodeVM } from 'baset-vm';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import { Writable } from 'stream';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const renderInContextScript = readFile(path.resolve(__dirname, 'renderInContext.js'), { encoding: 'utf8' });
const matchInContextScript = readFile(path.resolve(__dirname, 'matchInContext.js'), { encoding: 'utf8' });
const base64prefix = 'data:image/png;base64,';

export default class PixiResolver extends AbstractResolver {
    match = async (obj: any, context: NodeVM, sandbox: utils.IDictionary<any>) => {
        sandbox.basetResolverPixi__ObjectToMatch = obj;

        return context.run(await matchInContextScript, 'PixiResolver.js').matchResult;
    }
    resolve = async (obj: any, context: NodeVM, sandbox: utils.IDictionary<any>) => {
        sandbox.basetResolverPixi__ObjectToRender = obj;
        const value = new Promise(async (resolve, reject) => {
            // here we got base64 string from canvas object
            const base64String: string = await context.run(await renderInContextScript, 'PixiResolver.js').renderedResult;
            // but it's platform dependent and base64 string differs on win and *nix
            // so we'll use JS implementation of png coder/decoder to ensure that
            // result is similar in all platforms
            const imgBuffer = new Buffer(base64String.replace(base64prefix, ''), 'base64');
            const png = new PNG({ colorType: 2 });
            const bufferChunks: any[] = [];
            const dest = new Writable({
                write(chunk, encoding, done)  {
                    bufferChunks.push(chunk);
                    done();
                },
            });
            png.parse(imgBuffer, err => (!err)
                ? png.pack()
                    .pipe(dest)
                    .on('finish', () => resolve(`${base64prefix}${Buffer.concat(bufferChunks).toString('base64')}`))
                : reject(err));
        });

        return {
            value: await value,
            [dataTypes.image]: 'base64',
        };
    }
}
