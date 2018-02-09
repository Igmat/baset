import { OptionManager, transform, util } from 'babel-core';
import { AbstractReader, AddFileResolver, AddHook, utils } from 'baset-core';
import { sync } from 'find-up';
import fs from 'fs';
import path from 'path';

export interface IBabelReaderOptions {
    config: any;
}
export default class BabelReader extends AbstractReader {
    private exts = [...util.canCompile.EXTENSIONS];
    private config: any;
    constructor(public pluginsOptions: IBabelReaderOptions) {
        super(pluginsOptions);

        this.config = pluginsOptions && pluginsOptions.config || {};
    }

    read = async (filePath: string, spec: Promise<string | string[]>) => {
        const ext = path.extname(filePath);
        const sources = await spec;

        return (sources instanceof Array)
            ? sources.map((src, index) => this.compile(src, `${filePath}.${index}${ext}`))
            : this.compile(sources, filePath);
    }
    registerHook = (addHook: AddHook, addFileResolver: AddFileResolver) => {
        addHook(this.compile, { exts: this.exts, matcher: filename => !filename.includes('node_modules') });
    };

    private compile = (code: string, filename: string) => {
        const opts = new OptionManager().init({
            sourceRoot: path.dirname(filename),
            ...this.config,
            filename,
        });

        if (opts === null) return code;

        const result = transform(code, opts);

        return result.code || '';
    };
}
