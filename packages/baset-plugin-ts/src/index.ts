import { sync } from 'find-up';
import * as fs from 'fs';
import * as path from 'path';
import { CompilerOptions, transpileModule } from 'typescript';
import { isPrimitive, promisify } from 'util';

const readFile = promisify(fs.readFile);

export interface ITypeScriptReaderOptions {
    config: string | { compilerOptions: CompilerOptions };
}
export default class TypeScriptReader {
    private compilerOptions: CompilerOptions;
    constructor(private options?: ITypeScriptReaderOptions) {
        const config = (!options)
            ? (() => {
                const configPath = sync('tsconfig.json');
                if (!configPath) throw new Error("We can't find TS config file for your tests");

                return configPath;
            })()
            : options.config;

        this.compilerOptions = (typeof config === 'string')
            ? require(path.resolve(config))
            : config;
    }

    read = async (filePath: string, spec: string | Promise<string>) => {
        if (typeof spec !== 'string' || spec.length) throw new Error('TypeScript plugin have to be first in plugins chain');
        const src = await readFile(filePath, { encoding: 'utf8' });

        return transpileModule(src, {
            compilerOptions: this.compilerOptions,
            fileName: filePath,
        }).outputText;
    }
}
