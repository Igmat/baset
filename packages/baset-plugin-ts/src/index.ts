import { sync } from 'find-up';
import * as path from 'path';
import { Options, register } from 'ts-node';
import { CompilerOptions } from 'typescript';
import { isPrimitive } from 'util';

export interface ITypeScriptReaderOptions {
    config: string | { compilerOptions: CompilerOptions };
}
export default class TypeScriptReader {
    constructor(private options?: ITypeScriptReaderOptions) {
        const config = (!options)
            ? (() => {
                const configPath = sync('tsconfig.json');
                if (!configPath) throw new Error("We can't find TS config file for your tests");

                return configPath;
            })()
            : options.config;

        const registerOptions: Options = (typeof config === 'string')
            ? { project: path.resolve(config) }
            : { compilerOptions: config.compilerOptions };

        register(registerOptions);
        // TODO: investigate do we need https://www.npmjs.com/package/tsconfig-paths
    }

    read = async (filePath: string, spec: string | Promise<string>) => {
        if (typeof spec !== 'string' || spec.length) throw new Error('TypeScript plugin have to be first in plugins chain');

        return filePath;
    }
}
