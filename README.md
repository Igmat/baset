![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
[![License](https://img.shields.io/badge/license-MIT%20License-brightgreen.svg)](https://opensource.org/licenses/MIT)

[![Greenkeeper badge](https://badges.greenkeeper.io/Igmat/baset.svg)](https://greenkeeper.io/)
[![Travis CI](https://travis-ci.org/Igmat/baset.svg?branch=master)](https://travis-ci.org/Igmat/baset)
[![Build status](https://ci.appveyor.com/api/projects/status/xpalrob91ur08xtt?svg=true)](https://ci.appveyor.com/project/Igmat/baset)

[![npm badge][npm-badge-png]][package-url]

[npm-badge-png]: https://nodei.co/npm/baset.png?mini=true
[package-url]: https://npmjs.com/package/baset

# BaseT
> Tool for testing using baseline strategy.

> **WARNING:** it's early beta, so documentation may have mistakes, if you face any problems feel free to create [issues](https://github.com/Igmat/baset/issues).

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is it?](#what-is-it)
- [How it works?](#how-it-works)
- [Why I have to use it?](#why-i-have-to-use-it)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Plugins](#plugins)
- [Roadmap](#roadmap)
- [Changelog](#changelog)
- [How to Contribute](#how-to-contribute)
- [How to Make Pull Request](#how-to-make-pull-request)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is it?
This tool much like [Jest](https://facebook.github.io/jest/) or [Mocha](https://mochajs.org/) gives you an opportunity to test your application by creating unit-tests, it also supports end-to-end testing (**actually WILL support**).

But unlike other most known frameworks it uses another approach which could be named **Baseline Strategy**. Initially inspired by [TypeScript](https://github.com/Microsoft/TypeScript) tests (see them [here](https://github.com/Microsoft/TypeScript/tree/master/tests)) it looks like thing that's able to change way we're testing.

## How it works?
Let's assume you have module `yourModule.js` that export one function.  
Baseline test (e.g. `yourModule.spec.js`) will look like this:
```JavaScript
const yourModule = require('yourModule');

const oneUsage = yourModule('arguments', 'of', 'your', 'function');
const severalUsages = ['array', 'of', 'arguments'].map(yourModule);
let resultOfComplexUsageScenario;
// some code/function/promise that fulfils
// `resultOfComplexUsageScenario` with (a)sync value(s)

// actually any code that uses `yourModule` could be here

module.exports = {
    oneUsage,
    severalUsages,
    resultOfComplexUsageScenario,
    // any number of additional values
}
```
Running `baset` for this test will produce file `yourModule.spec.base.tmp`. It's temporary unverified baseline and contains all exported values (e.g. `oneUsage`, `severalUsages`, etc.) - just take a look at them and if you think they are correct run `baset accept` and `yourModule.spec.base` will be generated.  
From this point you have tests for `yourModule` that describe its behavior.  
All further test runs will compare generated `yourModule.spec.base.tmp` with `yourModule.spec.base` and fail if they are different.

## Why I have to use it?
You haven't, but if you:
- love [TDD](https://en.wikipedia.org/wiki/Test-driven_development)
- hate [TDD](https://en.wikipedia.org/wiki/Test-driven_development)
- don't care about it, but want to cover your application with tests
- want to test everything
- want to test only improtant cases
- tired from `describe`, `it`, `equalsTo` that blows your tests and forces you to write a lot of code to test `helloWorld.js`
- heard that tests are nearly the best type of [documentation](https://en.wikipedia.org/wiki/Unit_testing#Documentation)
- never heard previous statement
- disagree with it, because specs are unreadable in majority of cases
- want it to be true for your project
- feel lack of real usage examples in your project even though it has 100% coverage
- feel lack of automated testing even though your documentation is full of examples

It worth trying `baset`.

## Installation
For global, just run:
```
npm install -g baset
```
But we're recomending:
```
npm install --save-dev baset
```
and adding next lines to `scripts` section in your `package.json`:
```JSON
"test": "baset",
"accept": "baset accept"
```

## Usage
From command line:

```
baset <command> [options]
```
Commands:

|  Name  |                             Description                              | Aliases |
| ------ | -------------------------------------------------------------------- | ------- |
| test   | **Default.** Creating temp baseline and comparing it to existing one | t       |
| accept | Accepting new baseline                                               | a       |

Options:

|    Option     |           Description           |  Type   |          Default value           |
| ------------- | ------------------------------- | ------- | -------------------------------- |
| --version     | Show version number             | boolean |                                  |
| --specs, -s   | Glob pattern for spec files     | string  | `"**/*.spec.js"`                 |
| --bases, -b   | Glob pattern for baseline files | string  | `"**/*.base"`                    |
| --help, -h    | Show help                       | boolean |                                  |
| --plugins, -p | Plugins used for your tests     | string  | `".spec.js$:baset-plugin-export` |
| --options, -o | Options for plugins             | TBD     | `{}`                             |

In your `package.json`:
```JSON
{
    "scripts": {
        "test": "baset",
        "accept": "baset accept"
    },
    "baset": {
        "specs": "**/*.spec.js",
        "bases": "**/*.base",
        "plugins": {
            ".spec.js$": ["baset-plugin-module-name", "baset-plugin-export"]
        },
        "options": {
            "baset-plugin-module-name": {
                // List of options for baset plugin.
                // All available should be listed at
                // plugins README.md file.
            }
        }
    }
}
```
In `.basetrc` or `.basetrc.json`:
```JSON
{
    "specs": "**/*.spec.js",
    "bases": "**/*.base",
    "plugins": {
        ".spec.js$": ["baset-plugin-module-name", "baset-plugin-export"]
    },
    "options": {
        "baset-plugin-module-name": {
            // List of options for baset plugin.
            // All available should be listed at
            // plugins README.md file.
        }
    }
}
```

## Examples
Our [tests folder](./tests) contains projects used for end-to-end tests of `baset` package (using `baset` itself, of course), so you can use them as references for integrating baset into your workflow.

## Plugins
There are only 2 plugins right now:  
1. [`baset-plugin-export`](./packages/baset-plugin-export) - default plugin that used for creating baseline from exported values of spec
2. [`baset-plugin-ts`](./packages/baset-plugin-ts) - simple plugin that allows to write specs using [TypeScript](https://www.typescriptlang.org/)

## Roadmap
Unfortunately, not yet ready, but you may find our nearest goals at [our board](https://github.com/Igmat/baset/projects/1)

## Changelog
Recent changes can be viewed on the [CHANGELOG.md](CHANGELOG.md)

## How to Contribute
Read to contribute [CONTRIBUTING.md](CONTRIBUTING.md)

## How to Make Pull Request
Read to contribute [PULL_REQUEST_TEMPLATE.md](PULL_REQUEST_TEMPLATE.md)

## License

Copyright (c) Ihor Chulinda.  
This source code is licensed under the [MIT license](LICENSE).
