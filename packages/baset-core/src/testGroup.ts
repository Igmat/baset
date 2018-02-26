import { CompilerFunction, NodeVM, NodeVMOptions, ResolverFunction } from 'baset-vm';
import fs from 'fs';
import path from 'path';
import { isPrimitive } from 'util';
import { AbstractBaseliner, IBaselinerConstructor } from './abstractBaseliner';
import { AbstractEnvironmet } from './abstractEnvironment';
import { AbstractReader, IHookOptions, IReaderConstructor } from './abstractReader';
import { IDictionary, readFile } from './utils';

export const circularReference = Symbol('circularReference');

export class TestGroup {
    private baseliner: AbstractBaseliner;
    // private environemt: AbstractEnvironmet;
    private references = new WeakMap<object, string>();
    private pattern: RegExp;
    private readerChain: AbstractReader[];
    constructor(
        pattern: string,
        readerNames: string[],
        baselinerName: string,
        pluginsOptions: IDictionary<any>,
        private environment?: string) {
        this.pattern = new RegExp(pattern);

        this.readerChain = readerNames.map(readerName => {
            const reader: IReaderConstructor = require(path.resolve(readerName)).default;

            return new reader(pluginsOptions[readerName]);
        });
        const baseliner: IBaselinerConstructor = require(path.resolve(baselinerName)).default;
        this.baseliner = new baseliner(pluginsOptions[baselinerName]);
    }

    match = (filePath: string) =>
        this.pattern.test(filePath);

    read = async (filePath: string) => {
        const resolvedPath = path.resolve(filePath);
        const compiler = this.getCompiler();
        const context = new NodeVM({
            require: {
                builtin: ['*'],
                context: 'sandbox',
                external: true,
                import: this.environment
                    ? [this.environment]
                    : undefined,
            },
            compiler: compiler.compile,
            sourceExtensions: compiler.extensions,
            resolveFilename: compiler.resolveFilename,
        });
        const specSrc = readFile(resolvedPath, { encoding: 'utf8' });
        const compiledSrc = await this.readerChain
            .reduce<Promise<string | string[]>>((result, reader) => reader.read(filePath, result), specSrc);
        const tests = (compiledSrc instanceof Array)
            ? compiledSrc
            : [compiledSrc];
        const testsExports = tests.map((test, index) => context.run(test, `${resolvedPath}.${index}.js`));
        const testsResults = testsExports.map((value, index) => this.calculateValues(value, `exports[${index}]`));

        return this.baseliner.create(testsResults);
    }
    // tslint:disable-next-line:no-any
    private calculateValues = async (obj: any, name = 'exports'): Promise<any> => {
        if (isPrimitive(obj)) return obj;
        if (this.references.has(obj)) return this.createSelfReference(obj);
        this.references.set(obj, name);
        if (obj instanceof Promise) return obj;
        if (obj instanceof Function) return obj.toString().split('\n')[0];
        if (Array.isArray(obj)) return await Promise.all(obj.map((value, key) => this.calculateValues(value, `${name}[${key}]`)));

        return (await Promise.all(Object.keys(obj)
            .map(async key => ({ [key]: await this.calculateValues(obj[key], `${name}.${key}`) }))))
            .reduce((result, prop) => ({ ...result, ...prop }), {});
    }

    private createSelfReference = (obj: any) => ({
        [circularReference]: this.references.get(obj),
    })

    private getCompiler = () => {
        const hooks = this.getHooks();
        const resolvers = this.getResolvers();
        this.readerChain.reverse().forEach(reader => reader.registerHook(hooks.addHook, resolvers.addResolver));

        return {
            compile: (code: string, filename: string) =>
                hooks.compileFns[path.extname(filename)](code, filename),
            extensions: hooks.extensions,
            resolveFilename: resolvers.resolve,
        };
    }

    private getHooks = () => {
        const extensions: string[] = ['.js'];
        const compileFns: IDictionary<CompilerFunction> = {
            ['.js']: defaultCompile,
        };

        return {
            addHook: (hook: CompilerFunction, options?: IHookOptions) => {
                const exts = options && options.exts || ['.js'];
                const matcher = options && options.matcher || defaultMatcher;
                exts.forEach(ext => {
                    const oldCompiler = compileFns[ext] || compileFns['.js'];
                    compileFns[ext] = (code: string, filename: string) =>
                        matcher(filename)
                            ? oldCompiler(hook(code, filename), filename)
                            : oldCompiler(code, filename);
                    !extensions.find(value => value === ext) && extensions.push(ext);
                });
            },
            extensions,
            compileFns,
        };
    }

    private getResolvers = () => {
        const resolvers: ((original: ResolverFunction) => ResolverFunction)[] = [];

        return {
            addResolver: (fn: ((original: ResolverFunction) => ResolverFunction)) =>
                resolvers.push(fn),
            resolve: (original: ResolverFunction, request: string) =>
                resolvers.reduce((result, resolver) => resolver(result), original)(request),
        };
    }
}

function defaultCompile(code: string, filename: string) {
    return code;
}
function defaultMatcher(filename: string) {
    return true;
}
