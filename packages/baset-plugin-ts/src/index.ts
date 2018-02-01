import { AbstractReader, AddFileResolver, AddHook, utils } from 'baset-core';
import { sync } from 'find-up';
import * as fs from 'fs';
import * as path from 'path';
import { createMatchPath } from 'tsconfig-paths';
import { CompilerOptions, transpile, transpileModule } from 'typescript';

export interface ITypeScriptReaderOptions {
    config: string | { compilerOptions: CompilerOptions };
}
export default class TypeScriptReader extends AbstractReader {
    private exts = ['.ts'];
    private config: { compilerOptions: CompilerOptions };
    private absoluteBaseUrl: string;
    // tslint:disable-next-line:no-any
    constructor(public pluginsOptions: ITypeScriptReaderOptions) {
        super(pluginsOptions);
        const config = (!pluginsOptions)
            ? (() => {
                const configPath = sync('tsconfig.json');
                if (!configPath) throw new Error("We can't find TS config file for your tests");

                return configPath;
            })()
            : pluginsOptions.config;

        this.config = (typeof config === 'string')
            ? require(path.resolve(config))
            : config;

        this.absoluteBaseUrl = path.resolve(this.config.compilerOptions.baseUrl || '');
        if (this.config.compilerOptions.jsx) this.exts.push('.tsx');
        if (this.config.compilerOptions.allowJs) this.exts.push('.js');
        if (this.config.compilerOptions.allowJs && this.config.compilerOptions.jsx) this.exts.push('.jsx');
    }

    read = async (filePath: string, spec: Promise<string | string[]>) => {
        const ext = path.extname(filePath);
        const sources = await spec;

        return (sources instanceof Array)
            ? sources.map((src, index) => this.compile(src, `${filePath}.${index}${ext}`))
            : this.compile(sources, filePath);
    }
    registerHook = (addHook: AddHook, addFileResolver: AddFileResolver) => {
        const matchPath = createMatchPath(
            this.absoluteBaseUrl,
            this.config.compilerOptions.paths || {},
        );
        addHook(this.compile, { exts: this.exts, matcher: () => true });
        addFileResolver(original =>
            (request: string) => {
                const found = matchPath(request, undefined, undefined, this.exts);

                return found
                    ? original(found)
                    : original(request);
            });
    };

    private compile = (code: string, filename: string) => transpileModule(code, {
        compilerOptions: this.config.compilerOptions,
        fileName: filename,
    }).outputText;
}
