# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.14.7"></a>
## [0.14.7](https://github.com/Igmat/baset/compare/v0.14.6...v0.14.7) (2018-10-10)


### Bug Fixes

* **core:** execute functions if they are exported directly ([4d64a8d](https://github.com/Igmat/baset/commit/4d64a8d))





<a name="0.14.6"></a>
## [0.14.6](https://github.com/Igmat/baset/compare/v0.14.5...v0.14.6) (2018-10-09)


### Bug Fixes

* **core:** proper plugin options resolving ([20e92ff](https://github.com/Igmat/baset/commit/20e92ff))





<a name="0.14.4"></a>
## [0.14.4](https://github.com/Igmat/baset/compare/v0.14.3...v0.14.4) (2018-10-07)


### Bug Fixes

* **core:** pass mock options to vm ([b114f69](https://github.com/Igmat/baset/commit/b114f69))





<a name="0.14.3"></a>
## [0.14.3](https://github.com/Igmat/baset/compare/v0.14.2...v0.14.3) (2018-10-07)


### Bug Fixes

* **core:** add better handling for errors in tests ([91f2825](https://github.com/Igmat/baset/commit/91f2825))





<a name="0.14.2"></a>
## [0.14.2](https://github.com/Igmat/baset/compare/v0.14.1...v0.14.2) (2018-09-17)

**Note:** Version bump only for package baset-core





<a name="0.13.7"></a>
## [0.13.7](https://github.com/Igmat/baset/compare/v0.13.6...v0.13.7) (2018-08-30)


### Bug Fixes

* **core:** changes for working with reworked vm ([d30224f](https://github.com/Igmat/baset/commit/d30224f))
* **core:** minor performance and compile time bugfixes ([ea46ea8](https://github.com/Igmat/baset/commit/ea46ea8))




<a name="0.13.6"></a>
## [0.13.6](https://github.com/Igmat/baset/compare/v0.13.5...v0.13.6) (2018-06-10)




**Note:** Version bump only for package baset-core

<a name="0.13.4"></a>
## [0.13.4](https://github.com/Igmat/baset/compare/v0.13.3...v0.13.4) (2018-06-08)




**Note:** Version bump only for package baset-core

<a name="0.13.1"></a>
## [0.13.1](https://github.com/Igmat/baset/compare/v0.13.0...v0.13.1) (2018-06-02)


### Performance Improvements

* **core:** reuse context by default ([a09b925](https://github.com/Igmat/baset/commit/a09b925))




<a name="0.13.0"></a>
# [0.13.0](https://github.com/Igmat/baset/compare/v0.12.1...v0.13.0) (2018-05-31)


### Features

* **core:** much more informative test results ([5223279](https://github.com/Igmat/baset/commit/5223279)), closes [#55](https://github.com/Igmat/baset/issues/55)




<a name="0.12.0"></a>
# [0.12.0](https://github.com/Igmat/baset/compare/v0.11.1...v0.12.0) (2018-05-03)


### Bug Fixes

* **core:** correct order of readers ([b6c6777](https://github.com/Igmat/baset/commit/b6c6777))




<a name="0.11.1"></a>
## [0.11.1](https://github.com/Igmat/baset/compare/v0.11.0...v0.11.1) (2018-03-15)




**Note:** Version bump only for package baset-core

<a name="0.11.0"></a>
# [0.11.0](https://github.com/Igmat/baset/compare/v0.10.0...v0.11.0) (2018-03-08)


### Bug Fixes

* **core:** duplicated methods in scaffolder ([bd52c7b](https://github.com/Igmat/baset/commit/bd52c7b))


### Features

* **core:** generating and writing scaffolded specs ([7f68128](https://github.com/Igmat/baset/commit/7f68128))
* **core:** initial scaffolder implementation ([be067e4](https://github.com/Igmat/baset/commit/be067e4))




<a name="0.10.0"></a>
# [0.10.0](https://github.com/Igmat/baset/compare/v0.9.1...v0.10.0) (2018-03-07)


### Bug Fixes

* **core:** don't dispose env because it happens to early ([ef3b5fa](https://github.com/Igmat/baset/commit/ef3b5fa))


### Features

* **core:** abstract environment api ([f37f42f](https://github.com/Igmat/baset/commit/f37f42f))




<a name="0.9.0"></a>
# [0.9.0](https://github.com/Igmat/baset/compare/v0.8.0...v0.9.0) (2018-03-03)


### Bug Fixes

* **core:** adding context and sandbox object to resolvers ([a56d1b1](https://github.com/Igmat/baset/commit/a56d1b1))
* **core:** moving responsibility for comparison to baseliners ([4f6c260](https://github.com/Igmat/baset/commit/4f6c260))
* **core:** selecting baseline ext by baseliner ([b68a4b9](https://github.com/Igmat/baset/commit/b68a4b9))
* **core:** shared data-types for resolver/baseliner interaction ([48816d5](https://github.com/Igmat/baset/commit/48816d5))


### Features

* **core:** adding data type for html resolving ([8689b29](https://github.com/Igmat/baset/commit/8689b29))
* **core:** api for resolvers that may work with different value types ([f8ddd23](https://github.com/Igmat/baset/commit/f8ddd23))




<a name="0.8.0"></a>
# [0.8.0](https://github.com/Igmat/baset/compare/v0.7.5...v0.8.0) (2018-02-28)


### Features

* **core:** adding option to use global imports e.g. polyfills ([8871185](https://github.com/Igmat/baset/commit/8871185)), closes [#41](https://github.com/Igmat/baset/issues/41)




<a name="0.7.4"></a>
## [0.7.4](https://github.com/Igmat/baset/compare/v0.7.3...v0.7.4) (2018-02-26)


### Bug Fixes

* **core:** don't execute functions in export ([8a06736](https://github.com/Igmat/baset/commit/8a06736)), closes [#44](https://github.com/Igmat/baset/issues/44)
* **core:** resolving circular dependencies in exports ([bb966f9](https://github.com/Igmat/baset/commit/bb966f9)), closes [#43](https://github.com/Igmat/baset/issues/43)




<a name="0.7.3"></a>
## [0.7.3](https://github.com/Igmat/baset/compare/v0.7.2...v0.7.3) (2018-02-13)




**Note:** Version bump only for package baset-core

<a name="0.7.2"></a>
## [0.7.2](https://github.com/Igmat/baset/compare/v0.7.1...v0.7.2) (2018-02-12)




**Note:** Version bump only for package baset-core

<a name="0.7.1"></a>
## [0.7.1](https://github.com/Igmat/baset/compare/v0.7.0...v0.7.1) (2018-02-09)


### Bug Fixes

* **core:** reverse hook order, so transformation will go right ([c9c89f8](https://github.com/Igmat/baset/commit/c9c89f8)), closes [#9](https://github.com/Igmat/baset/issues/9)




<a name="0.6.0"></a>
# [0.6.0](https://github.com/Igmat/baset/compare/v0.5.1...v0.6.0) (2018-02-08)


### Bug Fixes

* **solution:** correct dependecies versions ([f272f03](https://github.com/Igmat/baset/commit/f272f03))


### Features

* **core:** compiler and context arguments for plugins ([b2e4a67](https://github.com/Igmat/baset/commit/b2e4a67))
* **core:** inital support for different envs ([73ee117](https://github.com/Igmat/baset/commit/73ee117))




<a name="0.5.1"></a>
## [0.5.1](https://github.com/Igmat/baset/compare/v0.5.0...v0.5.1) (2018-01-29)


### Bug Fixes

* **core:** replace all line endings with LF and trim baseline ([3d75a3e](https://github.com/Igmat/baset/commit/3d75a3e)), closes [#32](https://github.com/Igmat/baset/issues/32)




<a name="0.5.0"></a>
# [0.5.0](https://github.com/Igmat/baset/compare/v0.4.1...v0.5.0) (2018-01-26)


### Features

* **solution:** plugins architecture initial implementation ([92f598c](https://github.com/Igmat/baset/commit/92f598c)), closes [#5](https://github.com/Igmat/baset/issues/5)




<a name="0.4.1"></a>
## [0.4.1](https://github.com/Igmat/baset/compare/v0.4.0...v0.4.1) (2018-01-24)




**Note:** Version bump only for package baset-core

<a name="0.4.0"></a>
# [0.4.0](https://github.com/Igmat/baset/compare/v0.3.0...v0.4.0) (2018-01-24)


### Features

* **Core:** Recursivly check exports to work with promises and functions ([fbf5eb0](https://github.com/Igmat/baset/commit/fbf5eb0))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/Igmat/baset/compare/v0.2.2...v0.3.0) (2018-01-23)


### Bug Fixes

* **CLI:** Non-zero exit code for fail and more informative message ([1aaff03](https://github.com/Igmat/baset/commit/1aaff03)), closes [#2](https://github.com/Igmat/baset/issues/2)




<a name="0.2.2"></a>
## [0.2.2](https://github.com/Igmat/baset/compare/v0.2.1...v0.2.2) (2018-01-22)


### Bug Fixes

* **Core:** Adding beautifier for JSON output and using relative pathes in console ([bc81077](https://github.com/Igmat/baset/commit/bc81077))




<a name="0.2.1"></a>
## [0.2.1](https://github.com/Igmat/baset/compare/v0.2.0...v0.2.1) (2018-01-18)


### Bug Fixes

* **Core:** Removing temp files after accepting new baseline ([cb13be3](https://github.com/Igmat/baset/commit/cb13be3))




<a name="0.2.0"></a>
# [0.2.0](https://github.com/Igmat/baset/compare/v0.1.0...v0.2.0) (2018-01-17)


### Features

* **Core, CLI:** Adding two different commands (test and accept), also introducing yargs to parse ar ([2d98352](https://github.com/Igmat/baset/commit/2d98352))




<a name="0.1.0"></a>
# [0.1.0](https://github.com/Igmat/baset/compare/v0.0.1...v0.1.0) (2018-01-17)


### Features

* **Core:** Added simple comparison between temp and existing baseline ([f0a775b](https://github.com/Igmat/baset/commit/f0a775b))




<a name="0.0.1"></a>
## 0.0.1 (2018-01-16)




**Note:** Version bump only for package baset-core
