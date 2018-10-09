[![Known Vulnerabilities](https://snyk.io/test/npm/baset-reader-babel/badge.svg)](https://snyk.io/test/npm/baset-reader-babel)

# BaseT Babel plugin
> Babel reader plugin for [BaseT](https://github.com/Igmat/baset) project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation and usage](#installation-and-usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation and usage
Run:
```
npm install --save-dev baset-reader-babel
```
and adding next line to `baset.plugins` section in your `package.json` or `plugins` section in your `.basetrc`/`.basetrc.json`:
```JSON
".spec.jsx?$": ["baset-reader-babel", "baset-baseliner-json"]
```
You may also specify additional options for this plugin under `baset.options` section in your `package.json` or `options` section in your `.basetrc`/`.basetrc.json`:
```JavaScript
"baset-reader-babel": {
    // by default this reader uses the same strategy for resolving configuration
    // as babel, but you may want to specify some additional settings only for tests
    // this options gives you such an opportunity
    "config": {
        // your additional configuration  for babel
    },
    // by default any files inside node_modules are explicitly ignored
    // but in some cases you may want to transpile them as well,
    // in order to do so, just set this option to true
    "includeNodeModules": true
}
```
