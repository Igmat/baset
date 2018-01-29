import { AbstractPlugin } from 'baset-core';
import * as fs from 'fs';
import * as beautify from 'json-beautify';
import * as path from 'path';
import { isPrimitive, promisify } from 'util';
import { NodeVM } from 'vm2';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export default class ExportReader extends AbstractPlugin {
    read = async (filePath: string, spec: string | Promise<string>) => {
        let result;
        const specValue = (typeof spec === 'string')
            ? spec
            : await spec;
        if (!specValue.length || specValue === filePath) {
            result = require(path.resolve(filePath));
        } else {
            // FIXME:
            // this part of code never used for now, because doesn't handle
            // working with transpiled spec that imports something that
            // also has to be transpiled before execution
            // usefull links for further research
            // https://nodejs.org/api/modules.html#modules_require_extensions
            // https://nodejs.org/api/vm.html
            // https://github.com/patriksimek/vm2
            const tmpFilePath = path.resolve(`${filePath}.${Date.now()}.js`);
            await writeFile(tmpFilePath, specValue);
            result = require(path.resolve(tmpFilePath));
            await unlink(tmpFilePath);
        }

        return beautify(await this.calculateValues(result), undefined, 4, 20);
    }

    // tslint:disable-next-line:no-any
    private calculateValues = async (obj: any): Promise<any> => {
        if (isPrimitive(obj)) return obj;
        else if (obj instanceof Promise) return obj;
        else if (obj instanceof Function) return obj();
        else if (obj instanceof Array) return await Promise.all(obj.map(this.calculateValues));

        return (await Promise.all(Object.keys(obj)
            .map(async key => ({ [key]: await this.calculateValues(obj[key]) }))))
            .reduce((result, prop) => ({ ...result, ...prop }), {});
    }
}
