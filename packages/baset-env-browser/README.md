[![Known Vulnerabilities](https://snyk.io/test/npm/baset-env-browser/badge.svg)](https://snyk.io/test/npm/baset-env-browser)

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
".spec.js$": ["baset-env-browser", "baset-baseliner-json"], // JavaScript
".spec.ts$": ["baset-env-browser", "baset-reader-ts", "baset-baseliner-json"] // TypeScript
```
You may also use static files server, by specifying at least one of following options,
```JSON
"baset-env-browser": {
    "serverPort": 1337, // port that will be used for serving files, 1337 is default value
    "staticFolder": "./path/to/your/static/files" // root folder of your files, current working directory by default
}
```
This config will run [express.static server](http://expressjs.com/en/4x/api.html#express.static) at `http://localhost:1337/` that will serve files from `staticFolder`.  
In most cases it's not needed, but sometimes (e.g. for [PIXI loaders](http://pixijs.download/dev/docs/PIXI.loaders.Loader.html)) it could be necessary, because framework/library may heavily depend on fetching some files from server.
