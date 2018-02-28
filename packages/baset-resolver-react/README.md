# BaseT React resolver
> React resolver for [BaseT](https://github.com/Igmat/baset) project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation and usage](#installation-and-usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation and usage
Run:
```
npm install --save-dev baset-resolver-react
```
and adding next line to `baset.plugins` section in your `package.json` or `plugins` section in your `.basetrc`/`.basetrc.json`:
```JSON
".spec.js$": ["baset-resolver-react", "baset-baseliner-json"]
```
No additional options available for this plugin for now.
