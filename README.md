[![Become a patron](./docs/images/become_a_patron_button.png)](https://www.patreon.com/igmat)

![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
[![License](https://img.shields.io/badge/license-MIT%20License-brightgreen.svg)](https://opensource.org/licenses/MIT)

[![Greenkeeper badge](https://badges.greenkeeper.io/Igmat/baset.svg)](https://greenkeeper.io/)
[![Travis CI](https://travis-ci.org/Igmat/baset.svg?branch=master)](https://travis-ci.org/Igmat/baset)
[![Build status](https://ci.appveyor.com/api/projects/status/xpalrob91ur08xtt/branch/master?svg=true)](https://ci.appveyor.com/project/Igmat/baset/branch/master)

[![npm badge][npm-badge-png]][package-url]

[npm-badge-png]: https://nodei.co/npm/baset.png?downloads=true&downloadRank=true&stars=true
[package-url]: https://npmjs.com/package/baset

# ![BaseT](/docs/images/logo.svg)
> Tool for testing using baseline strategy.

> **WARNING:** it's early beta, so documentation may have mistakes, if you face any problems feel free to create [issues](https://github.com/Igmat/baset/issues).

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is it?](#what-is-it)
- [Motivation](#motivation)
- [How it works?](#how-it-works)
- [Why I have to use it?](#why-i-have-to-use-it)
- [Installation](#installation)
- [Usage](#usage)
  - [Plugins configuration](#plugins-configuration)
    - [Using configuration file (same for `package.json`)](#using-configuration-file-same-for-packagejson)
    - [Using CLI](#using-cli)
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

## Motivation
Current situation with **TDD** and tooling around it is complicated.  
There are a lot of problems and corner cases. And while everybody agrees that unit-testing is generally correct approach, amount of efforts required by it frequently makes TDD unsuitable for particular project.

We are trying to change it.

Our goal is moving TDD from processes (like agile, scrum, waterfall, etc.) to developer's tooling (like linters, compilers, etc.).  
In order to achieve it we have to focus on real strengths of TDD and unit-testing:

1. Preventing unintentional breaking changes, in other words freezing existing behavior as some sort of 'baseline';
2. Using documentation samples as tests and using tests as documentation.

To understand core idea and approach better, you can read [**Is TDD wrong?**](./docs/Is_TDD_wrong.md) ([RU](./docs/Is_TDD_wrong.RU.md))

## How it works?
Let's assume you have module `yourModule.js` that exports one function.  
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
Run:
```
baset test
```
And this test will produce file `yourModule.spec.tmp.base`.  
It's temporary unverified baseline and contains all exported values (e.g. `oneUsage`, `severalUsages`, etc.).
Just take a look at them and if you think they are correct run:
```
baset accept
```
And `yourModule.spec.base` will be generated.  
From this point you have **test** and **baseline** for `yourModule` that describe its behavior.  
All further test runs will compare generated `yourModule.spec.tmp.base` with `yourModule.spec.base` and _fail_ if they are different, or _pass_ otherwise.

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

|   Name   |                             Description                              | Aliases |
| -------- | -------------------------------------------------------------------- | ------- |
| test     | **Default.** Creating temp baseline and comparing it to existing one | t       |
| accept   | Accepting new baseline                                               | a       |
| scaffold | Scaffolding specs for existing code                                  | s       |

Options:

|                Option                |                     Description                     |                       Type                        |           Default value            |
| ------------------------------------ | --------------------------------------------------- | ------------------------------------------------- | ---------------------------------- |
| &#8209;&#8209;version                | Show version number                                 | boolean                                           |                                    |
| &#8209;&#8209;specs,&nbsp;&#8209;s   | Glob pattern for spec files                         | string                                            | `"**/*.spec.js"`                   |
| &#8209;&#8209;bases,&nbsp;&#8209;b   | Glob pattern for baseline files                     | string                                            | `"**/*.base"`                      |
| &#8209;&#8209;help,&nbsp;&#8209;h    | Show help                                           | boolean                                           |                                    |
| &#8209;&#8209;plugins,&nbsp;&#8209;p | Plugins used for your tests                         | string \| [configuration](#plugins-configuration) | `".spec.js$:baset-baseliner-json"` |
| &#8209;&#8209;options,&nbsp;&#8209;o | Options for plugins                                 | TBD                                               | `{}`                               |
| &#8209;&#8209;files,&nbsp;&#8209;f   | Glob pattern for project files. Used by scaffolder. | string                                            | `undefined`                        |

In your `package.json`:
```JavaScript
{
    "scripts": {
        "test": "baset",
        "accept": "baset accept"
    },
    "baset": {
        "specs": "**/*.spec.js",
        "bases": "**/*.base",
        "plugins": {
            ".spec.js$": ["baset-plugin-module-name", "baset-baseliner-json"]
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
```JavaScript
{
    "specs": "**/*.spec.js",
    "bases": "**/*.base",
    "plugins": {
        ".spec.js$": ["baset-plugin-module-name", "baset-baseliner-json"]
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

### Plugins configuration
The most important configuration option is `plugins`. You may configure it via command line or via configuration file or even using `baset` section in `package.json`.

#### Using configuration file (same for `package.json`)
```JSON
{
    "plugins": {
        "${pattern}": "${options}"
    }
}
```
`${pattern}` - is regular expression for filename of your test files, so you may define different plugin options for different file types (e.g. using `baset-reader-ts` for `.ts` files and `baset-reader-babel` for `.js` files).  
`${options}` - is `string` or `string[]` or `object` with following fields:

|   Field     |                                                                         Description                                                                          |        Type         |    Default value     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | -------------------- |
| baseliner   | name or path to module, that is responsible for generating baseline                                                                                          | string **Required** | baset-baseliner-json |
| environment | name or path to module, that mimics desired environment (e.g. browser)                                                                                       | string              | undefined            |
| readers     | name or path to module(s), that reads and transpiles specs and source code (e.g. babel, typescript)                                                          | string[] \| string  | undefined            |
| resolvers   | name or path to module(s), that is able to resolve specific values (e.g. [react](https://reactjs.org/) components or [pixi](http://www.pixijs.com/) sprites) | string[] \| string  | undefined            |
| imports     | name or path to module(s), that should be imported in test context (e.g. polyfills or [reflect-metadata](https://github.com/rbuckton/reflect-metadata))      | string[] \| string  | undefined            |

If `${options}` is `string`, then it used as `baseliner` name or path.  
If `${options}` is `string[]`, then it has to follow next agreement for its content:
```
["-env-pluginOrPath", ..."importPaths", ..."-reader-pluginsOrPaths",  ..."-resolver-pluginsOrPaths", "-baseliner-pluginOrPath"]
```
Where everything except `baseliner` is optional and `...` means that several entities are allowed.
> **NOTE:** grouping of entities is based on their names, so all plugins _MUST_ contain substring `-(env|reader|resolver|baseliner)-`, except imports (last ones don't have any naming requirements).

#### Using CLI
Just type following command in your favorite terminal:
```
baset -p ${pattern}:${options}
```
`${pattern}` - is regular expression for filename of your test files (same as in previous paragraph).  
`${options}` - is `string[]`, where values are separated by `:` sign. This array has exactly same semantic as using `string[]` in configuration file.

## Examples
Our [tests folder](./tests) contains projects used for end-to-end tests of `baset` package (using `baset` itself, of course), so you can use them as references for integrating baset into your workflow.

## Plugins
There are only few plugins right now:  
1. [`baset-baseliner-json`](./packages/baset-baseliner-json) - default plugin that used for creating baseline from exported values of spec
2. [`baset-baseliner-md`](./packages/baset-baseliner-md) - plugin that used for creating baselines in Markdown format
3. [`baset-env-browser`](./packages/baset-env-browser) - simple plugin that enables browser API in specs and sources using [jsdom](https://github.com/jsdom/jsdom) package.
4. [`baset-reader-ts`](./packages/baset-reader-ts) - simple plugin that allows to write specs using [TypeScript](https://www.typescriptlang.org/)
5. [`baset-reader-babel`](./packages/baset-reader-babel) - simple plugin that allows to write specs using [Babel](https://babeljs.io/)
6. [`baset-resolver-react`](./packages/baset-resolver-react) - simple plugin that resolves [react](https://reactjs.org/) components as `html`
7. [`baset-resolver-pixi`](./packages/baset-resolver-pixi) - simple plugin that resolver [pixi](http://www.pixijs.com/) DisplayObject as `base64` encoded image

## Roadmap
You may track progress for first stable release at [this milestone](https://github.com/Igmat/baset/milestone/1)

## Changelog
Recent changes can be viewed on the [CHANGELOG.md](CHANGELOG.md)

## How to Contribute
Read to contribute [CONTRIBUTING.md](docs/CONTRIBUTING.md)

## How to Make Pull Request
Read to contribute [PULL_REQUEST_TEMPLATE.md](docs/PULL_REQUEST_TEMPLATE.md)

## License

Copyright (c) Ihor Chulinda.  
This source code is licensed under the [MIT license](LICENSE).
