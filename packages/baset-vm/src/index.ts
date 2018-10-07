import { EventEmitter } from 'events';
import fs from 'fs';
import pa from 'path';
import vm from 'vm';
import { VMError } from './VMError';
import { VMScript } from './VMScript';

export {
    VMError,
    VMScript,
};

const sb = fs.readFileSync(`${__dirname}${pa.sep}sandbox.js`, 'utf8');

function compileToJS(code: string, compiler: string | CompilerFunction, filename = '') {
    if (typeof compiler === 'function') return compiler(code, filename);

    switch (compiler) {
        case 'javascript':
        case 'java-script':
        case 'js':
        case 'text/javascript':
            return code;

        default:
            throw new VMError(`Unsupported compiler '${compiler}'.`);
    }
}

/**
 * Require options for a VM
 */
export interface IVMRequire {
    /** Array of allowed builtin modules, accepts ["*"] for all (default: none) */
    builtin?: string[] | {
        [index: string]: unknown;
    };
    /**
     * `host` (default) to require modules in host and proxy them to sandbox. `sandbox` to load, compile and
     * require modules in sandbox. Builtin modules except `events` always required in host and proxied to sandbox
     */
    context?: 'host' | 'sandbox';
    /** `true` or an array of allowed external modules (default: `false`) */
    external?: boolean | string[];
    /** Array of modules to be loaded into NodeVM on start. */
    import?: string[];
    /** Restricted path where local modules can be required (default: every path). */
    root?: string;
    /** Collection of mock modules (both external or builtin). */
    mock?: {
        [index: string]: unknown;
    };
}
export type CompilerFunction = (code: string, filename: string) => string;
export type ResolverFunction = (request: string) => string | null;
/**
 * Options specific for Node VM
 */
export interface INodeVMOptions {
    /**
     * `javascript` (default) or custom compiler function (which receives the code, and it's filepath).
     *  The library expects you to have coffee-script pre-installed if the compiler is set to `coffeescript`.
     */
    compiler?: 'javascript' | CompilerFunction;
    /** VM's global object. */
    sandbox?: {
        [index: string]: unknown;
    };
    /**
     * Script timeout in milliseconds.  Timeout is only effective on code you run through `run`.
     * Timeout is NOT effective on any method returned by VM.
     */
    timeout?: number;

    /** File extensions that the internal module resolver should accept. */
    sourceExtensions?: string[];

    resolveFilename?: false | ((original: ResolverFunction, request: string) => string | null);
    /** `inherit` to enable console, `redirect` to redirect to events, `off` to disable console (default: `inherit`). */
    console?: 'inherit' | 'redirect';
    /** `true` or an object to enable `require` options (default: `false`). */
    require?: boolean | IVMRequire;
    /** `true` to enable VMs nesting (default: `false`). */
    nesting?: boolean;
    /** `commonjs` (default) to wrap script into CommonJS wrapper, `none` to retrieve value returned by the script. */
    wrapper?: 'commonjs' | 'none';
}

/**
 * Class NodeVM.
 */
export class NodeVM extends EventEmitter {
    /**
     * VM options.
     */
    options: Required<INodeVMOptions>;
    private context: vm.Context;
    private prepareRequire: (dirname?: string) => (moduleName: string) => unknown;
    /**
     * Create NodeVM instance.
     * Unlike VM, NodeVM lets you use require same way like in regular node.
     * @param options VM options.
     */
    constructor(options: INodeVMOptions = {}) {
        super();

        // defaults
        this.options = {
            sandbox: options.sandbox || { },
            console: options.console || 'inherit',
            require: options.require || false,
            compiler: options.compiler || 'javascript',
            nesting: options.nesting || false,
            wrapper: options.wrapper || 'commonjs',
            sourceExtensions: options.sourceExtensions || ['.js'],
            resolveFilename: options.resolveFilename || false,
            timeout: options.timeout || 0,
        };

        const nesting = (this.options.nesting)
            ? {
                NodeVM,
            }
            : {};
        const host = {
            require,
            process,
            console,
            setTimeout,
            setInterval,
            setImmediate,
            clearTimeout,
            clearInterval,
            clearImmediate,
            String,
            Number,
            Buffer,
            Boolean,
            Array,
            Date,
            Error,
            RangeError,
            ReferenceError,
            SyntaxError,
            TypeError,
            RegExp,
            Object,
            VMError,
            Proxy,
            Reflect,
            Map,
            WeakMap,
            Set,
            WeakSet,
            Promise,
            // This item also was here, but it seems to broke stuff like jsdom
            // So we `fn instanceof Function` always will be false if used for object
            // from `vm` outside of it, but `typeof fn === 'function'` still works properly,
            // and seems to be better solution
            /* Function */
            ...nesting,

            // prepare global sandbox
            ...this.options.sandbox,
        };

        this.context = vm.createContext();

        const closure: Function = vm.runInContext(sb, this.context, {
            filename: `${__dirname}${pa.sep}sandbox.js`,
            displayErrors: false,
        });
        Object.setPrototypeOf(host, global);

        this.prepareRequire = closure.call(this.context, this, host);

        if (this.options.require && this.options.require !== true && this.options.require.import) {
            if (!Array.isArray(this.options.require.import)) {
                this.options.require.import = [this.options.require.import];
            }

            for (let i = 0, l = this.options.require.import.length; i < l; i++) {
                this.require(this.options.require.import[i]);
            }
        }
    }

    /**
     * Require a module in VM and return it's exports.
     * @param module Module name.
     * @returns Exported module.
     */
    require<T = unknown>(module: string): T {
        return this.run(`module.exports = require('${module}');`, 'vm.js');
    }

    /**
     * Run the code in NodeVM.
     * First time you run this method, code is executed same way like in node's regular `require` -
     * it's executed with `module`, `require`, `exports`, `__dirname`, `__filename` variables and expect result in `module.exports'.
     * @param code Code to run.
     * @param filename Filename that shows up in any stack traces produced from this script.
     * @returns Result of executed code.
     */
    run<T = unknown>(codeInput: string, filenameInput?: string): T {
        const code = (this.options.compiler !== 'javascript')
            ? compileToJS(codeInput, this.options.compiler, filenameInput)
            : '';

        const filename = filenameInput && pa.resolve(filenameInput);
        const dirname = filename && pa.dirname(filename);

        const module = vm.runInContext('({exports: {}})', this.context, {
            displayErrors: false,
        });

        const script = new VMScript(code, filename);
        script.wrap('(function (exports, require, module, __filename, __dirname) { ', ' \n})');

        const closure = script.compile().runInContext(this.context, {
            filename: script.filename,
            displayErrors: false,
        });

        const returned = closure.call(this.context, module.exports, this.prepareRequire(dirname), module, filename, dirname);

        return (this.options.wrapper === 'commonjs')
            ? module.exports
            : returned;
    }

    /**
     * Create NodeVM and run code inside it.
     * @param script Javascript code.
     * @param filename File name (used in stack traces only).
     * @param options VM options.
     * @return VM.
     */
    static code(script: string, options?: object): NodeVM;
    static code(script: string, filename: string, options?: object): NodeVM;
    static code(script: string, filename?: string | object, options?: object): NodeVM {
        const resultFilename = (filename !== undefined && typeof filename === 'string')
            ? pa.resolve(filename)
            : '';
        const resultOptions = (filename !== undefined && typeof filename === 'object')
            ? filename
            : options;

        return new NodeVM(resultOptions).run(script, resultFilename);
    }

    /**
     * Create NodeVM and run script from file inside it.
     * @param filename File name (used in stack traces only).
     * @param options VM options.
     * @returns VM.
     */
    static file(filename: string, options: object): NodeVM {
        const resolvedFilename = pa.resolve(filename);

        if (!fs.existsSync(resolvedFilename)) {
            throw new VMError(`Script '${resolvedFilename}' not found.`);
        }

        if (fs.statSync(resolvedFilename).isDirectory()) {
            throw new VMError('Script must be file, got directory.');
        }

        return new NodeVM(options).run(fs.readFileSync(resolvedFilename, 'utf8'), resolvedFilename);
    }
}
