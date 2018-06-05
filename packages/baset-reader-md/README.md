[![Known Vulnerabilities](https://snyk.io/test/npm/baset-reader-md/badge.svg)](https://snyk.io/test/npm/baset-reader-md)

# BaseT MarkDown reader plugin
> MarkDown reader plugin for [BaseT](https://github.com/Igmat/baset) project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation and usage](#installation-and-usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation and usage
Run:
```
npm install --save-dev baset-reader-md
```
and adding next line to `baset.plugins` section in your `package.json` or `plugins` section in your `.basetrc`/`.basetrc.json`:
```JSON
".spec.md$": ["baset-reader-md", "baset-baseliner-json"]
```
There are no specific options for this plugin right now.
