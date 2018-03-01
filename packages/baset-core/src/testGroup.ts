import { CompilerFunction, NodeVM, NodeVMOptions, ResolverFunction } from 'baset-vm';
import fs from 'fs';
import path from 'path';
import { isPrimitive } from 'util';
import { AbstractBaseliner, IBaselinerConstructor } from './abstractBaseliner';
import { AbstractEnvironmet } from './abstractEnvironment';
import { AbstractReader, IHookOptions, IReaderConstructor } from './abstractReader';
import { AbstractResolver, IResolverConstructor } from './abstractResolver';
import { IDictionary, readFile } from './utils';

export const circularReference = Symbol('circularReference');

export interface ITestGroupOptions {
    baseliner: string;
    environment?: string;
    readers: string[];
    resolvers: string[];
    imports: string[];
}

export class TestGroup {
    private baseliner: AbstractBaseliner;
    // private environemt: AbstractEnvironmet;
    private references = new WeakMap<object, string>();
    private pattern: RegExp;
    private readerChain: AbstractReader[];
    private resolvers: AbstractResolver[];
    private allImports: string[];
    private indexOfResolver: (obj: any, context: NodeVM, sandbox: IDictionary<any>) => Promise<number>;
    constructor(
        pattern: string | RegExp,
        private options: ITestGroupOptions,
        private pluginsOptions: IDictionary<any>) {
        this.pattern = new RegExp(pattern);

        const baseliner: IBaselinerConstructor = require(path.resolve(options.baseliner)).default;
        this.baseliner = new baseliner(pluginsOptions[options.baseliner]);

        this.readerChain = options.readers.map(readerName => {
            const reader: IReaderConstructor = require(path.resolve(readerName)).default;

            return new reader(pluginsOptions[readerName]);
        });

        this.resolvers = options.resolvers.map(resolverName => {
            const resolver: IResolverConstructor = require(path.resolve(resolverName)).default;

            return new resolver(pluginsOptions[resolverName]);
        });

        const resolveMatchers = this.resolvers
            .map((resolver, index) =>
                async (toMatch: any, context: NodeVM, sandbox: IDictionary<any>) => resolver.match(toMatch, context, sandbox));
        this.indexOfResolver = async (obj: any, context: NodeVM, sandbox: IDictionary<any>) =>
            (await Promise.all(
                resolveMatchers
                    .map(matcher => matcher(obj, context, sandbox))))
                .indexOf(true);

        this.allImports = [
            options.environment,
            ...options.imports,
        ].filter((importName): importName is string => !!importName);
    }

    match = (filePath: string) =>
        this.pattern.test(filePath);

    read = async (filePath: string) => {
        const resolvedPath = path.resolve(filePath);
        const compiler = this.getCompiler();
        const sandbox: IDictionary<any> = {};
        const context = new NodeVM({
            require: {
                builtin: ['*'],
                context: 'sandbox',
                external: true,
                import: this.allImports,
            },
            sandbox: { basetSandbox: sandbox },
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
        const testsResults = testsExports.map((value, index) => this.calculateValues(value, context, sandbox, `exports[${index}]`));

        return this.baseliner.create(testsResults);
    }
    // tslint:disable-next-line:no-any
    private calculateValues = async (obj: any, context: NodeVM, sandbox: IDictionary<any>, name = 'exports'): Promise<any> => {
        const resolverIndex = await this.indexOfResolver(obj, context, sandbox);
        if (resolverIndex !== -1) return this.resolvers[resolverIndex].resolve(obj, context, sandbox);
        if (isPrimitive(obj)) return obj;
        if (this.references.has(obj)) return this.createSelfReference(obj);
        this.references.set(obj, name);
        if (obj instanceof Promise) return this.calculateValues(await obj, context, sandbox, name);
        if (obj instanceof Function) return obj.toString().split('\n')[0];
        if (Array.isArray(obj)) {
            return await Promise.all(
                obj.map((value, key) =>
                    this.calculateValues(value, context, sandbox, `${name}[${key}]`)));
        }

        return (await Promise.all(Object.keys(obj)
            .map(async key => ({ [key]: await this.calculateValues(obj[key], context, sandbox, `${name}.${key}`) }))))
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
