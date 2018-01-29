import * as fs from 'fs';
import * as path from 'path';
import { isPrimitive, promisify } from 'util';
import { CompilerFunction, NodeVM } from 'vm2';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const isExists = promisify(fs.exists);
const unlink = promisify(fs.unlink);

function defaultJsCompiler(code: string, filename: string) {
    return code;
}

export abstract class AbstractPlugin {
    abstract read: (filePath: string, result: string | Promise<string>) => Promise<string> | string;
    constructor(
        public compilers: IDictionary<CompilerFunction>,
        public context: NodeVM,
        // tslint:disable-next-line:no-any
        public pluginsOptions: any) { }
}
type IPluginConstructor =
    // tslint:disable-next-line:no-any
    new (compilers: IDictionary<CompilerFunction>, context: NodeVM, pluginsOptions: any) => AbstractPlugin;

export interface IDictionary<T> {
    [index: string]: T;
}

export class Tester {
    private readers: {
        pattern: RegExp;
        read(filePath: string): Promise<string> | string;
    }[];
    private compilers: {
        [index: string]: (code: string, filename: string) => string;
    } = {
            '.js': defaultJsCompiler,
            '.json': defaultJsCompiler,
            '.node': defaultJsCompiler,
        };
    private context: NodeVM;

    // tslint:disable-next-line:no-any
    constructor(readers: IDictionary<string[]>, pluginsOptions: IDictionary<any>) {
        this.readers = this.initPlugins(readers, pluginsOptions);
        this.context = new NodeVM({
            require: {
                builtin: ['*'],
                external: true,
                context: 'sandbox',
            },
            compiler: this.compile,
        });
    }

    test(specs: string[], baselines: string[]) {
        return specs.map(this.testSpec);
    }
    accept(files: string[]) {
        return files.map(this.acceptBase);
    }

    private testSpec = async (name: string) => {
        const reader = this.readers.find(({ pattern }) => pattern.test(name));
        if (!reader) throw new Error(`No reader defined for ${name}!`);
        const output = (await reader.read(name)).replace(/\r?\n|\r/g, '\n').trim();
        const ext = path.extname(name);
        const baselinePath = path.resolve(name.replace(new RegExp(`${ext}$`), '.base'));
        const baselineValue = await isExists(baselinePath)
            ? (await readFile(baselinePath, { encoding: 'utf-8' })).replace(/\r?\n|\r/g, '\n').trim()
            : false;
        await writeFile(path.resolve(`${baselinePath}.tmp`), output);

        return {
            name,
            isPassed: baselineValue === output,
            expected: baselineValue || '',
            actual: output,
        };
    }

    private acceptBase = async (name: string) => {
        const baseline = await readFile(path.resolve(name), { encoding: 'utf-8' });
        const filePath = name.replace(/.tmp$/, '');
        await writeFile(path.resolve(filePath), baseline);
        await unlink(path.resolve(name));

        return filePath;
    }

    // tslint:disable-next-line:no-any
    private initPlugins = (plugins: IDictionary<string[]>, pluginsOptions: IDictionary<any>) =>
        Object.keys(plugins).map(key => {
            const chain = plugins[key].map(plugin => {
                const Plugin: IPluginConstructor = require(path.resolve(plugin)).default;

                return new Plugin(this.compilers, this.context, pluginsOptions[plugin]);
            });

            return {
                pattern: new RegExp(key),
                read: (filePath: string) => chain.reduce<string | Promise<string>>((result, plugin) => plugin.read(filePath, result), ''),
            };
        })

    private compile = (code: string, filePath: string) => {
        const compiler = this.compilers[path.extname(filePath)];
        if (!compiler) throw new Error(`There is no compiler for "${path.extname(filePath)}" filetype`);

        return compiler(code, filePath);
    }
}
