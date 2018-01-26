# BaseT TypeScript plugin
> TypeScript reader plugin for [BaseT](https://github.com/Igmat/baset) project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation and usage](#installation-and-usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation and usage
Run:
```
npm install --save-dev baset-plugin-ts
```
and adding next line to `baset.plugins` section in your `package.json` or `plugins` section in your `.basetrc`/`.basetrc.json`:
```JSON
".spec.ts$": ["baset-plugin-ts", "baset-plugin-export"]
```
You may also specify additional options for this plugin under `baset.options` section in your `package.json` or `options` section in your `.basetrc`/`.basetrc.json`:
```JSON
"baset-plugin-ts": {
    "config": "./tsconfig.json"  // path to your config
}
```
or
```JSON
"baset-plugin-ts": {
    "config": {
        "compilerOptions": {
            "target": "es2015",
            "module": "commonjs",
            // and any other options for compiler
        }
    }
}
```
Obviously, not every option for TS compiler will have noticeable impact on tests.

Full list of available compiler options you may find at [official TS documentation](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
