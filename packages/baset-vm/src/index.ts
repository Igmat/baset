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

const sb = fs.readFileSync(`${__dirname}/sandbox.js`, 'utf8');
const cf = fs.readFileSync(`${__dirname}/contextify.js`, 'utf8');

const PROTECTED = ['constructor', '__proto__'];

const _compileToJS = function compileToJS(code: string, compiler: string | CompilerFunction, filename = '') {
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
};

/**
 * Require options for a VM
 */
export interface IVMRequire {
    /** Array of allowed builtin modules, accepts ["*"] for all (default: none) */
    builtin?: string[];
    /*
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
    mock?: any;
}
export type CompilerFunction = (code: string, filename: string) => string | VMScript;
export type ResolverFunction = (request: string) => string;
/**
 *  Options for creating a NodeVM
 */
export interface IVMOptions {
    /**
     * `javascript` (default) or custom compiler function (which receives the code, and it's filepath).
     *  The library expects you to have coffee-script pre-installed if the compiler is set to `coffeescript`.
     */
    compiler?: 'javascript' | CompilerFunction;
    /** VM's global object. */
    sandbox?: {
        [index: string]: any;
    };
    /**
     * Script timeout in milliseconds.  Timeout is only effective on code you run through `run`.
     * Timeout is NOT effective on any method returned by VM.
     */
    timeout?: number;

    /** File extensions that the internal module resolver should accept. */
    sourceExtensions?: string[];

    resolveFilename?: false | ((original: ResolverFunction, request: string) => string);
}

/**
 * Class VM.
 */
export class VM extends EventEmitter {
    /**
     * VM options.
     */
    options: IVMOptions;
    private context: vm.Context;
    private _internal: any;

    /**
     * Create VM instance.
     * @param options VM options.
     */
    constructor(options: IVMOptions = {}) {
        super();

        // defaults
        this.options = {
            timeout: options.timeout !== undefined ? options.timeout : undefined,
            sandbox: options.sandbox !== undefined ? options.sandbox : undefined,
            compiler: options.compiler !== undefined ? options.compiler : 'javascript',
        };

        const host = {
            console,
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
            Function,
            Object,
            VMError,
            Proxy,
            Reflect,
            Map,
            WeakMap,
            Set,
            WeakSet,
            Promise,
        };

        this.context = vm.createContext();

        Reflect.defineProperty(this, '_internal', {
            value: vm.runInContext(`(function(require, host) { ${cf} \n})`, this.context, {
                filename: `${__dirname}/contextify.js`,
                displayErrors: false,
            }).call(this.context, require, host),
        });

        // prepare global sandbox
        if (this.options.sandbox) {
            if (typeof this.options.sandbox !== 'object') {
                throw new VMError('Sandbox must be object.');
            }

            for (const name in this.options.sandbox) {
                if (!this.options.sandbox.hasOwnProperty(name)) continue;
                this._internal.Contextify.globalValue(this.options.sandbox[name], name);
            }
        }
    }

    /**
     * Freezes the object inside VM making it read-only. Not available for primitive values.
     * @param value Object to freeze.
     * @param globalName Whether to add the object to global.
     * @returns Object to freeze.
     */
    freeze<T extends object>(value: T, globalName: string) {
        this._internal.Contextify.readonly(value);
        if (global) this._internal.Contextify.globalValue(value, globalName);

        return value;
    }

    /**
     * Protects the object inside VM making impossible to set functions as it's properties. Not available for primitive values.
     * @param value Object to protect.
     * @param globalName Whether to add the object to global.
     * @returns Object to protect.
     */
    protect<T extends object>(value: T, globalName: string) {
        this._internal.Contextify.protected(value);
        if (global) this._internal.Contextify.globalValue(value, globalName);

        return value;
    }

    /**
     * Run the code in VM.
     * @param code Code to run.
     * @returns Result of executed code.
     */
    run<T = any>(code: string): T {
        const compiled = (this.options.compiler && this.options.compiler !== 'javascript')
            ? _compileToJS(code, this.options.compiler)
            : code;

        const script = compiled instanceof VMScript ? compiled : new VMScript(compiled);

        try {
            return this._internal.Decontextify.value(script.compile().compiled!.runInContext(this.context, {
                filename: script.filename,
                displayErrors: false,
                timeout: this.options.timeout,
            }));
        } catch (e) {
            throw this._internal.Decontextify.value(e);
        }
    }
}

/**
 * Options specific for Node VM
 */
export interface INodeVMOptions extends IVMOptions {
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
    private _internal: any;
    private context: vm.Context;
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
                VM,
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
            Function,
            Object,
            VMError,
            Proxy,
            Reflect,
            Map,
            WeakMap,
            Set,
            WeakSet,
            Promise,
            ...nesting,
        };

        this.context = vm.createContext();

        Object.defineProperty(this, '_internal', {
            value: vm.runInContext(`(function(require, host) { ${cf} \n})`, this.context, {
                filename: `${__dirname}/contextify.js`,
                displayErrors: false,
            }).call(this.context, require, host),
        });

        const closure = vm.runInContext(`(function (vm, host, Contextify, Decontextify, Buffer) { ${sb} \n})`, this.context, {
            filename: `${__dirname}/sandbox.js`,
            displayErrors: false,
        });

        Object.defineProperty(this, '_prepareRequire', {
            value: closure.call(this.context, this, host, this._internal.Contextify, this._internal.Decontextify, this._internal.Buffer),
        });

        // prepare global sandbox
        for (const name in this.options.sandbox) {
            if (!this.options.sandbox.hasOwnProperty(name)) continue;
            this._internal.Contextify.globalValue(this.options.sandbox[name], name);
        }

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
     * Freezes the object inside VM making it read-only. Not available for primitive values.
     * @param value Object to freeze.
     * @param globalName Whether to add the object to global.
     * @return Object to freeze.
     */
    freeze<T extends object>(value: T, globalName: string) {
        this._internal.Contextify.readonly(value);
        if (global) this._internal.Contextify.globalValue(value, globalName);
        return value;
    }

    /**
     * Protects the object inside VM making impossible to set functions as it's properties. Not available for primitive values.
     * @param value Object to protect.
     * @param globalName Whether to add the object to global.
     * @return Object to protect.
     */
    protect<T extends object>(value: T, globalName: string) {
        this._internal.Contextify.protected(value);
        if (global) this._internal.Contextify.globalValue(value, globalName);
        return value;
    }

    /**
     * Require a module in VM and return it's exports.
     * @param module Module name.
     * @returns Exported module.
     */
    require<T = any>(module: string): T {
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
    run<T = any>(code: string, filename?: string): T {
        if (this.options.compiler !== 'javascript') {
            code = _compileToJS(code, this.options.compiler, filename);
        }

        if (filename) {
            filename = pa.resolve(filename);
            const dirname = pa.dirname(filename);

        } else {
            filename = null;
            const dirname = null;
        }

        const module = vm.runInContext('({exports: {}})', this.context, {
            displayErrors: false,
        });

        const script = code instanceof VMScript ? code : new VMScript(code, filename);
        script.wrap('(function (exports, require, module, __filename, __dirname) { ', ' \n})');

        try {
            const closure = script.compile()._compiled.runInContext(this.context, {
                filename: script.filename,
                displayErrors: false,
            });

            const returned = closure.call(this.context, module.exports, this._prepareRequire(dirname), module, filename, dirname);
        } catch (e) {
            throw this._internal.Decontextify.value(e);
        }

        if (this.options.wrapper === 'commonjs') {
            return this._internal.Decontextify.value(module.exports);
        } else {
            return this._internal.Decontextify.value(returned);
        }
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
