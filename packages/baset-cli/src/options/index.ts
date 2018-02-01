import { utils } from 'baset-core';
import { Options } from 'yargs';

export interface IGlobalArgs {
    plugins: utils.IDictionary<string[]>;
    // tslint:disable-next-line:no-any
    options: utils.IDictionary<any>;
}

function resolveBasetPlugins(name: string) {
    return name.startsWith('baset-plugin')
        ? `./node_modules/${name}`
        : name;
}

export const options: utils.IDictionary<Options> = {
    plugins: {
        alias: 'p',
        describe: 'Plugins used for your tests',
        default: { '.spec.js$': 'baset-plugin-export' },
        coerce: (plugins: string[] | { [index: string]: string[] | string }) =>
            (plugins instanceof Array)
                // if plugins is Array, then we get this arg from cli
                ? plugins.reduce<{ [index: string]: string[] }>(
                    (result, plugin) => ({
                        ...result,
                        // regexp for spec      // array of node modules
                        [plugin.split(':')[0]]: plugin.split(':').slice(1).map(resolveBasetPlugins),
                    }),
                    {})
                // if not, then it defined in config
                : Object.keys(plugins).reduce<{ [index: string]: string[] }>(
                    // we have to ensure that all values are arrays
                    (result, key) => {
                        const plugin = plugins[key];

                        return {
                            ...result,
                            [key]: (plugin instanceof Array)
                                ? plugin.map(resolveBasetPlugins)
                                : [resolveBasetPlugins(plugin)],
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
