import { ITestGroupOptions, utils } from 'baset-core';
import path from 'path';
import { Options } from 'yargs';

export interface IGlobalArgs {
    plugins: utils.IDictionary<ITestGroupOptions>;
    // tslint:disable-next-line:no-any
    options: utils.IDictionary<any>;
}
export interface ITestGroupPlugins {
    baseliner: string;
    environment?: string;
    readers?: string[] | string;
    resolvers?: string[] | string;
    imports?: string[] | string;
    isolateContext?: boolean;
    mocks?: utils.IDictionary<string>;
}

function groupPlugins(plugins: string[]): ITestGroupOptions {
    const firstModule = plugins.slice(0, 1)[0];
    const environment = resolveModule((firstModule.includes('-env-') && firstModule) || undefined);
    const firstImportIndex = Number(!!environment);
    const firstReaderIndex = plugins.findIndex(plugin => plugin.includes('-reader-'));
    const firstResolverIndex = plugins.findIndex(plugin => plugin.includes('-resolver-'));
    const imports = plugins.slice(firstImportIndex, firstReaderIndex).map(resolveModule);
    const readers = plugins.slice(firstReaderIndex, firstResolverIndex).map(resolveModule);
    const resolvers = plugins.slice(firstResolverIndex, -1).map(resolveModule);
    const baseliner = resolveModule(plugins.slice(-1)[0]);

    return {
        baseliner,
        environment,
        readers,
        resolvers,
        imports,
        isolateContext: false,
        mocks: {},
    };
}
function getDefaultPlugins(plugins: ITestGroupPlugins): ITestGroupOptions {
    const {
        baseliner,
        environment,
        readers = [],
        resolvers = [],
        imports = [],
        mocks = {},
        isolateContext = false,
    } = plugins;

    return {
        baseliner: resolveModule(baseliner),
        environment: resolveModule(environment),
        readers: (Array.isArray(readers)
            ? readers
            : [readers]
        ).map(resolveModule),
        resolvers: (Array.isArray(resolvers)
            ? resolvers
            : [resolvers]
        ).map(resolveModule),
        imports: (Array.isArray(imports)
            ? imports
            : [imports]
        ).map(resolveModule),
        mocks: Object.keys(mocks).reduce(
            (result, mockName) => ({
                ...result,
                [mockName]: path.resolve(resolveModule(mocks[mockName])),
            }),
            {}),
        isolateContext,
    };
}
function resolveModule<T extends string | undefined>(name: T) {
    return (name && !name.startsWith('.') && !name.startsWith('/'))
        ? `./node_modules/${name}`
        : name;
}

export const options: utils.IDictionary<Options> = {
    plugins: {
        alias: 'p',
        describe: 'Plugins used for your tests',
        default: { '.spec.js$': 'baset-baseliner-json' },
        coerce: (plugins: string[] | utils.IDictionary<string[] | string | ITestGroupPlugins>) =>
            (Array.isArray(plugins))
                // if plugins is Array, then we get this arg from cli
                ? plugins.reduce<utils.IDictionary<ITestGroupOptions>>(
                    (result, plugin) => ({
                        ...result,
                        // regexp for spec      // array of plugins
                        [plugin.split(':')[0]]: groupPlugins(plugin.split(':').slice(1)),
                    }),
                    {})
                // if not, then it defined in config
                : Object.keys(plugins).reduce<utils.IDictionary<ITestGroupOptions>>(
                    // we have to ensure that all values are in correct format
                    (result, key) => {
                        const plugin = plugins[key];

                        return {
                            ...result,
                            [key]: (Array.isArray(plugin))
                                ? groupPlugins(plugin)
                                : (typeof plugin === 'string')
                                    ? groupPlugins([plugin])
                                    : getDefaultPlugins(plugin),
                        };
                    },
                    {}),
    },
    options: {
        alias: 'o',
        describe: 'Options for plugins',
        default: {},
    },
};
