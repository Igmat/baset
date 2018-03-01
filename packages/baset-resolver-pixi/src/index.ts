import { AbstractResolver, utils } from 'baset-core';
import { NodeVM } from 'baset-vm';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const renderInContextScript = readFile(path.resolve(__dirname, 'renderInContext.js'), { encoding: 'utf8' });
const matchInContextScript = readFile(path.resolve(__dirname, 'matchInContext.js'), { encoding: 'utf8'});

export default class PixiResolver extends AbstractResolver {
    match = async (obj: any, context: NodeVM, sandbox: utils.IDictionary<any>) => {
        sandbox.basetResolverPixi__ObjectToMatch = obj;

        return context.run(await matchInContextScript, 'PixiResolver.js').matchResult;
    }
    resolve = async (obj: any, context: NodeVM, sandbox: utils.IDictionary<any>) => {
        sandbox.basetResolverPixi__ObjectToRender = obj;

        return await context.run(await renderInContextScript, 'PixiResolver.js').renderedResult;
    }
}
