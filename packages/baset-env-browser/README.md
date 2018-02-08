# BaseT browser environment plugin
> Browser environment plugin for [BaseT](https://github.com/Igmat/baset) project.


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation and usage](#installation-and-usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation and usage
Run:
```
npm install --save-dev baset-env-browser
```
and adding next lines to `baset.plugins` section in your `package.json` or `plugins` section in your `.basetrc`/`.basetrc.json`:
```JSON
".spec.js$": ["baset-reader-ts", "baset-baseliner-json"], // JavaScript
".spec.ts$": ["baset-env-browser", "baset-reader-ts", "baset-baseliner-json"] // TypeScript
```

As for now, there are no options for this plugin.
