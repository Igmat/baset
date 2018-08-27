declare namespace NodeJS {
    interface Global {
        VMError: typeof import ('./VMError').VMError;
    }
}

interface IExtensions {
    [index: string]: (module: NodeJS.Module, filename: string, dirname: string) => unknown;
}
interface IModules {
    [index: string]: NodeJS.Module;
}
type IEventName =
    'beforeExit' |
    'disconnect' |
    'exit' |
    'rejectionHandled' |
    'uncaughtException' |
    'unhandledRejection' |
    'warning' |
    'message' |
    'newListener' |
    'removeListener';

// tslint:disable-next-line:no-unused-expression
(function sandbox(this: NodeJS.Global, vm: import ('./').NodeVM, host: import ('./').IHost) {
    'use strict';

    const { Script } = host.require('vm');
    const fs = host.require('fs');
    const pa = host.require('path');

    // tslint:disable-next-line:no-this-assignment
    const global = this;
    Object.assign(global, host);

    Object.setPrototypeOf(global, Object.prototype);

    Object.defineProperties(global, {
        global: { value: global },
        GLOBAL: { value: global },
        root: { value: global },
        isVM: { value: true },
    });
    const ERROR_CST = Error.captureStackTrace;

    /**
     * VMError definition.
     */
    class VMError extends Error {
        constructor(message: string, public code?: string) {
            super(message);

            ERROR_CST(this, this.constructor);
        }
    }

    global.VMError = VMError;

    // TODO: check if really exists in runtime
    // tslint:disable-next-line:no-any
    const BUILTIN_MODULES: IModules = (host.process as any).binding('natives');
    const JSON_PARSE = JSON.parse;

    const TIMERS = new host.WeakMap();
    const BUILTINS: IModules = {};
    const CACHE: IModules = {};
    const EXTENSIONS: IExtensions = {
        ['.json'](module: NodeJS.Module, filename: string) {
            try {
                module.exports = JSON_PARSE(fs.readFileSync(filename, 'utf8'));
            } catch (e) {
                throw e;
            }
        },
        ['.node'](module: NodeJS.Module, filename: string) {
            try {
                module.exports = host.require(filename);
            } catch (e) {
                throw e;
            }
        },
    };

    for (const ext of vm.options.sourceExtensions) {
        EXTENSIONS[ext] = (module, filename, dirname) => {
            if (typeof vm.options.require === 'boolean' || vm.options.require.context !== 'sandbox') {
                try {
                    module.exports = host.require(filename);
                } catch (e) {
                    throw e;
                }
            } else {
                try {
                    // Load module
                    let contents = fs.readFileSync(filename, 'utf8');
                    if (filename.endsWith(`tcomb${pa.sep}lib${pa.sep}isArray.js`)) {
                        contents = `module.exports = function isArray(x) {
                            return Array.isArray ? Array.isArray(x) : x instanceof Array;
                        };`;
                    }
                    if (typeof vm.options.compiler === 'function') {
                        contents = vm.options.compiler(contents, filename);
                    }

                    const code = `(function (exports, require, module, __filename, __dirname) { 'use strict'; ${contents} \n});`;

                    // Precompile script
                    const script = new Script(code, {
                        filename: filename || 'vm.js',
                        displayErrors: false,
                    });

                    const closure = script.runInContext(global, {
                        filename: filename || 'vm.js',
                        displayErrors: false,
                    });

                    // run script
                    closure(module.exports, module.require, module, filename, dirname);
                } catch (ex) {
                    throw ex;
                }
            }
        };
    }

    /**
     * Resolve filename.
     */
    function originalResolveFilename(path: string): string | null {
        const resolvedPath = pa.resolve(path);

        const exists = fs.existsSync(resolvedPath);
        const isDir = exists ? fs.statSync(resolvedPath).isDirectory() : false;

        // direct file match
        if (exists && !isDir) return resolvedPath;

        // load as file
        for (const ext of vm.options.sourceExtensions) {
            if (fs.existsSync(`${resolvedPath}${ext}`)) {
                const stat = fs.statSync(`${resolvedPath}${ext}`);
                // some directories could be named like `asn1.js`, so we have to check it here
                if (stat && !stat.isDirectory()) {
                    return `${resolvedPath}${ext}`;
                }
            }
        }
        if (fs.existsSync(`${resolvedPath}.node`)) return `${resolvedPath}.node`;
        if (fs.existsSync(`${resolvedPath}.json`)) return `${resolvedPath}.json`;

        // load as directory

        if (fs.existsSync(`${resolvedPath}/package.json`)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(`${resolvedPath}/package.json`, 'utf8'));
                if (pkg.main === undefined) pkg.main = 'index.js';

                return resolveFilename(`${resolvedPath}/${pkg.main}`);
            } catch (ex) {
                throw new VMError(`Module '${resolvedPath}' has invalid package.json`, 'EMODULEINVALID');
            }
        }

        for (const ext of vm.options.sourceExtensions) {
            if (fs.existsSync(`${resolvedPath}/index${ext}`)) return `${resolvedPath}/index${ext}`;
        }

        if (fs.existsSync(`${resolvedPath}/index.node`)) return `${resolvedPath}/index.node`;

        return null;
    }
    const { resolveFilename: providedResolveFilename } = vm.options;
    const resolveFilename = providedResolveFilename
        ? (path: string) => providedResolveFilename(originalResolveFilename, path)
        : originalResolveFilename;
    function resolveFilenameLikeNode(modulename: string, currentDirname: string) {
        // it could be found by custom resolver
        let filename = resolveFilename(modulename);
        if (!filename) {
            // Check node_modules in path
            if (!currentDirname) throw new VMError('You must specify script path to load relative modules.', 'ENOPATH');

            if (typeof vm.options.require !== 'boolean' && Array.isArray(vm.options.require.external)) {
                const isWhitelisted = vm.options.require.external.indexOf(modulename) !== -1;
                if (!isWhitelisted) throw new VMError(`The module '${modulename}' is not whitelisted in VM.`, 'EDENIED');
            }

            const paths = currentDirname.split(pa.sep);

            while (paths.length) {
                const path = paths.join(pa.sep);

                // console.log(`${path}${pa.sep}node_modules${pa.sep}${modulename}`)

                filename = resolveFilename(`${path}${pa.sep}node_modules${pa.sep}${modulename}`);
                if (filename) break;

                paths.pop();
            }
        }

        return filename;
    }

    function createModule(id: string, require: NodeRequireFunction, filename: string = id, exports: unknown = {}): NodeJS.Module {
        return {
            id,
            filename,
            exports,
            require,
            loaded: true,
            parent: null,
            children: [],
            paths: [id, filename],
        };
    }

    /**
     * Builtin require.
     */
    function getBuiltIn(modulename: string) {
        function requireBuiltin(builtInName: string) {
            if (builtInName === 'buffer') return ({ Buffer });
            if (BUILTINS[builtInName]) return BUILTINS[builtInName].exports; // Only compiled builtins are stored here

            if (builtInName === 'events') {
                try {
                    const script = new Script(
                        `(function (exports, require, module, process) { 'use strict'; ${BUILTIN_MODULES[builtInName]} \n});`,
                        {
                            filename: `${builtInName}.vm.js`,
                        },
                    );

                    // setup module scope
                    const module = createModule(builtInName, requireBuiltin, `${builtInName}.vm.js`);
                    BUILTINS[builtInName] = module;

                    // run script
                    script.runInContext(global)(module.exports, module.require, module, host.process);

                    return module.exports;
                } catch (e) {
                    throw e;
                }
            }

            return host.require(builtInName);
        }
        if (typeof vm.options.require !== 'boolean' && host.Array.isArray(vm.options.require.builtin)) {
            if (vm.options.require.builtin.indexOf('*') >= 0) {
                if (vm.options.require.builtin.indexOf(`-${modulename}`) >= 0) {
                    throw new VMError(`Access denied to require '${modulename}'`, 'EDENIED');
                }
            } else if (vm.options.require.builtin.indexOf(modulename) === -1) {
                throw new VMError(`Access denied to require '${modulename}'`, 'EDENIED');
            }
        } else if (
            typeof vm.options.require !== 'boolean' &&
            vm.options.require.builtin &&
            !host.Array.isArray(vm.options.require.builtin)) {
            if (!vm.options.require.builtin[modulename]) {
                throw new VMError(`Access denied to require '${modulename}'`, 'EDENIED');
            }
        } else {
            throw new VMError(`Access denied to require '${modulename}'`, 'EDENIED');
        }

        return requireBuiltin(modulename);
    }

    /**
     * Prepare require.
     */
    function prepareRequire(currentDirname: string) {
        return  function require(modulename: string) {
            if (vm.options.nesting && modulename === 'baset-vm') return { NodeVM: host.NodeVM };
            if (!vm.options.require) throw new VMError(`Access denied to require '${modulename}'`, 'EDENIED');
            if (modulename === undefined) throw new VMError("Module '' not found.", 'ENOTFOUND');
            if (typeof modulename !== 'string') throw new VMError(`Invalid module name '${modulename}'`, 'EINVALIDNAME');

            // Mock?
            if (typeof vm.options.require !== 'boolean' && vm.options.require.mock && vm.options.require.mock[modulename]) {
                return vm.options.require.mock[modulename];
            }

            // Builtin?

            if (BUILTIN_MODULES[modulename]) return getBuiltIn(modulename);

            // External?
            if (typeof vm.options.require === 'boolean' || !vm.options.require.external) {
                throw new VMError(`Access denied to require '${modulename}'`, 'EDENIED');
            }

            let filename: string | null = null;
            if (/^(\.|\.\/|\.\.\/)/.exec(modulename)) {
                // Module is relative file, e.g. ./script.js or ../script.js
                if (!currentDirname) throw new VMError('You must specify script path to load relative modules.', 'ENOPATH');

                filename = resolveFilename(`${currentDirname}/${modulename}`);
            } else {
                // Module is absolute file, e.g. /script.js or //server/script.js or C:\script.js
                filename = (/^(\/|\\|[a-zA-Z]:\\)/.exec(modulename))
                    ? resolveFilename(modulename)
                    : resolveFilenameLikeNode(modulename, currentDirname);
            }

            if (!filename) throw new VMError(`Cannot find module '${modulename}'`, 'ENOTFOUND');

            // return cache whenever possible
            if (CACHE[filename]) return CACHE[filename].exports;

            const dirname = pa.dirname(filename);
            const extname = pa.extname(filename);

            if (vm.options.require.root) {
                const requiredPath = pa.resolve(vm.options.require.root);
                if (dirname.indexOf(requiredPath) !== 0) {
                    throw new VMError(`Module '${modulename}' is not allowed to be required. The path is outside the border!`, 'EDENIED');
                }
            }

            const module = createModule(filename, prepareRequire(dirname));
            CACHE[filename] = module;

            // lookup extensions
            if (EXTENSIONS[extname]) {
                EXTENSIONS[extname](module, filename, dirname);

                return module.exports;
            }

            throw new VMError(`Failed to load '${modulename}': Unknown type.`, 'ELOADFAIL');
        };
    }

    /**
     * Prepare sandbox.
     */
    global.setTimeout = function (callback, delay, ...args) {
        const tmr = host.setTimeout(
            function () {
                callback.apply(null, args);
            },
            delay);

        const local = {
            ref() { return tmr.ref(); },
            unref() { return tmr.unref(); },
        };

        TIMERS.set(local, tmr);

        return local;
    };

    global.setInterval = function (callback, interval, ...args) {
        const tmr = host.setInterval(
            function () {
                callback.apply(null, args);
            },
            interval);

        const local = {
            ref() { return tmr.ref(); },
            unref() { return tmr.unref(); },
        };

        TIMERS.set(local, tmr);

        return local;
    };

    global.setImmediate = function (callback, ...args) {
        const tmr = host.setImmediate(function () {
            callback.apply(null, args);
        });

        const local = {
            ref() { return tmr.ref(); },
            unref() { return tmr.unref(); },
        };

        TIMERS.set(local, tmr);

        return local;
    };

    global.clearTimeout = function (local) {
        host.clearTimeout(TIMERS.get(local));
    };

    global.clearInterval = function (local) {
        host.clearInterval(TIMERS.get(local));
    };

    global.clearImmediate = function (local) {
        host.clearImmediate(TIMERS.get(local));
    };

    let processCwd: string;
    global.process = {
        argv: [],
        title: host.process.title,
        version: host.process.version,
        versions: host.process.versions,
        arch: host.process.arch,
        platform: host.process.platform,
        env: {},
        pid: host.process.pid,
        // features: host.process.features,
        uptime: host.process.uptime,
        nextTick: host.process.nextTick,
        hrtime: host.process.hrtime,
        cwd() { return processCwd || host.process.cwd(); },
        on(name: string, handler: any) {
            if (name !== 'beforeExit' && name !== 'exit') {
                throw new Error(`Access denied to listen for '${name}' event.`);
            }

            // FIXME: small hack for TS, because it has some problems with type narrowing here
            if (name === 'beforeExit') host.process.on(name, handler);
            if (name === 'exit') host.process.on(name, handler);

            return this;
        },
        chdir(directory: string) {
            processCwd = directory;
        },

        once(name: string, handler: any) {
            if (name !== 'beforeExit' && name !== 'exit') {
                throw new Error(`Access denied to listen for '${name}' event.`);
            }

            // FIXME: small hack for TS, because it has some problems with type narrowing here
            if (name === 'beforeExit') host.process.on(name, handler);
            if (name === 'exit') host.process.on(name, handler);

            return this;
        },

        listeners(name: string) {
            // FIXME: big hack for TS, because it has some problems with type narrowing here
            // tslint:disable-next-line:no-any
            return host.process.listeners(name as any) as any;
        },

        removeListener(name: string, handler: any) {
            host.process.removeListener(name, handler);

            return this;
        },

        umask() {
            if (arguments.length) {
                throw new Error('Access denied to set umask.');
            }

            return host.process.umask();
        },

    // TODO: investigate if there is a need of all process features
    // tslint:disable-next-line:no-any
    } as any as NodeJS.Process;

    // if (vm.options.console === 'inherit') {
    global.console = host.console;
    // } else if (vm.options.console === 'redirect') {
    //     global.console = {
    //         log(...args) {
    //             vm.emit('console.log', ...args);
    //         },
    //         info(...args) {
    //             vm.emit('console.info', ...args);
    //         },
    //         warn(...args) {
    //             vm.emit('console.warn', ...args);
    //         },
    //         error(...args) {
    //             vm.emit('console.error', ...args);
    //         },
    //         dir(...args) {
    //             vm.emit('console.dir', ...args);
    //         },
    //         time: () => { },
    //         timeEnd: () => { },
    //         trace(...args) {
    //             vm.emit('console.trace', ...args);
    //         },
    //     };
    // }

    /*
    Return contextized require.
    */

    return prepareRequire;
});
