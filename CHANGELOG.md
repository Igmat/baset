# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.14.1"></a>
## [0.14.1](https://github.com/Igmat/baset/compare/v0.14.0...v0.14.1) (2018-09-04)




**Note:** Version bump only for package root

<a name="0.14.0"></a>
# [0.14.0](https://github.com/Igmat/baset/compare/v0.13.7...v0.14.0) (2018-09-04)


### Features

* **resolver-react:** using react-test-render instead of react-dom ([1703b43](https://github.com/Igmat/baset/commit/1703b43))




<a name="0.13.7"></a>
## [0.13.7](https://github.com/Igmat/baset/compare/v0.13.6...v0.13.7) (2018-08-30)


### Bug Fixes

* **core:** changes for working with reworked vm ([d30224f](https://github.com/Igmat/baset/commit/d30224f))
* **core:** minor performance and compile time bugfixes ([ea46ea8](https://github.com/Igmat/baset/commit/ea46ea8))
* **env-browser:** changes for work with reworked vm ([748b5b1](https://github.com/Igmat/baset/commit/748b5b1))
* **resolver-pixi:** changes for work with reworked vm ([749501b](https://github.com/Igmat/baset/commit/749501b))
* **vm:** correct global for vm without broken function constructor ([1405c53](https://github.com/Igmat/baset/commit/1405c53)), closes [#58](https://github.com/Igmat/baset/issues/58)




<a name="0.13.6"></a>
## [0.13.6](https://github.com/Igmat/baset/compare/v0.13.5...v0.13.6) (2018-06-10)


### Bug Fixes

* **cli:** better initial output ([cff1126](https://github.com/Igmat/baset/commit/cff1126))




<a name="0.13.5"></a>
## [0.13.5](https://github.com/Igmat/baset/compare/v0.13.4...v0.13.5) (2018-06-08)




**Note:** Version bump only for package root

<a name="0.13.4"></a>
## [0.13.4](https://github.com/Igmat/baset/compare/v0.13.3...v0.13.4) (2018-06-08)




**Note:** Version bump only for package root

<a name="0.13.3"></a>
## [0.13.3](https://github.com/Igmat/baset/compare/v0.13.2...v0.13.3) (2018-06-08)




**Note:** Version bump only for package root

<a name="0.13.2"></a>
## [0.13.2](https://github.com/Igmat/baset/compare/v0.13.1...v0.13.2) (2018-06-07)




**Note:** Version bump only for package root

<a name="0.13.1"></a>
## [0.13.1](https://github.com/Igmat/baset/compare/v0.13.0...v0.13.1) (2018-06-02)


### Performance Improvements

* **cli:** options for isolated context ([ec05bfa](https://github.com/Igmat/baset/commit/ec05bfa))
* **core:** reuse context by default ([a09b925](https://github.com/Igmat/baset/commit/a09b925))




<a name="0.13.0"></a>
# [0.13.0](https://github.com/Igmat/baset/compare/v0.12.1...v0.13.0) (2018-05-31)


### Features

* **cli:** implementing tap compatible output ([80d2fc4](https://github.com/Igmat/baset/commit/80d2fc4)), closes [#55](https://github.com/Igmat/baset/issues/55)
* **cli:** option for using tap reporters ([4955454](https://github.com/Igmat/baset/commit/4955454)), closes [#55](https://github.com/Igmat/baset/issues/55)
* **core:** much more informative test results ([5223279](https://github.com/Igmat/baset/commit/5223279)), closes [#55](https://github.com/Igmat/baset/issues/55)




<a name="0.12.1"></a>
## [0.12.1](https://github.com/Igmat/baset/compare/v0.12.0...v0.12.1) (2018-05-29)


### Bug Fixes

* **baseliner-md:** change html beatifier package ([0078675](https://github.com/Igmat/baset/commit/0078675))




<a name="0.12.0"></a>
# [0.12.0](https://github.com/Igmat/baset/compare/v0.11.1...v0.12.0) (2018-05-03)


### Bug Fixes

* **baseliner-md:** changed default ext from .md to .base.md ([6c95d61](https://github.com/Igmat/baset/commit/6c95d61))
* **core:** correct order of readers ([b6c6777](https://github.com/Igmat/baset/commit/b6c6777))


### Features

* **reader-md:** initial simple implementation ([6a718eb](https://github.com/Igmat/baset/commit/6a718eb)), closes [#11](https://github.com/Igmat/baset/issues/11)




<a name="0.11.1"></a>
## [0.11.1](https://github.com/Igmat/baset/compare/v0.11.0...v0.11.1) (2018-03-15)


### Bug Fixes

* **cli:** filter content from node_modules to avoid redundant tests ([1c18533](https://github.com/Igmat/baset/commit/1c18533))




<a name="0.11.0"></a>
# [0.11.0](https://github.com/Igmat/baset/compare/v0.10.0...v0.11.0) (2018-03-08)


### Bug Fixes

* **cli:** readable output for scaffold command ([d5350db](https://github.com/Igmat/baset/commit/d5350db))
* **core:** duplicated methods in scaffolder ([bd52c7b](https://github.com/Igmat/baset/commit/bd52c7b))


### Features

* **cli:** scaffold command for cli ([4bb4534](https://github.com/Igmat/baset/commit/4bb4534))
* **core:** generating and writing scaffolded specs ([7f68128](https://github.com/Igmat/baset/commit/7f68128))
* **core:** initial scaffolder implementation ([be067e4](https://github.com/Igmat/baset/commit/be067e4))




<a name="0.10.0"></a>
# [0.10.0](https://github.com/Igmat/baset/compare/v0.9.1...v0.10.0) (2018-03-07)


### Bug Fixes

* **cli:** terminate process after accept is done ([6cf04ff](https://github.com/Igmat/baset/commit/6cf04ff))
* **core:** don't dispose env because it happens to early ([ef3b5fa](https://github.com/Igmat/baset/commit/ef3b5fa))


### Features

* **core:** abstract environment api ([f37f42f](https://github.com/Igmat/baset/commit/f37f42f))
* **env-browser:** using new api and providing server for statics ([36b9103](https://github.com/Igmat/baset/commit/36b9103))




<a name="0.9.1"></a>
## [0.9.1](https://github.com/Igmat/baset/compare/v0.9.0...v0.9.1) (2018-03-06)


### Bug Fixes

* **baseliner-md:** hotfix for error whith missing initial baeline ([27faecd](https://github.com/Igmat/baset/commit/27faecd))




<a name="0.9.0"></a>
# [0.9.0](https://github.com/Igmat/baset/compare/v0.8.0...v0.9.0) (2018-03-03)


### Bug Fixes

* **baseliner-md:** less strict image match - skips AA pixels ([cfe9550](https://github.com/Igmat/baset/commit/cfe9550))
* **core:** adding context and sandbox object to resolvers ([a56d1b1](https://github.com/Igmat/baset/commit/a56d1b1))
* **core:** moving responsibility for comparison to baseliners ([4f6c260](https://github.com/Igmat/baset/commit/4f6c260))
* **core:** selecting baseline ext by baseliner ([b68a4b9](https://github.com/Igmat/baset/commit/b68a4b9))
* **core:** shared data-types for resolver/baseliner interaction ([48816d5](https://github.com/Igmat/baset/commit/48816d5))
* **env-browser:** better support for external resources ([c354f44](https://github.com/Igmat/baset/commit/c354f44))
* **resolver-pixi:** explicit colorType set ([28722bc](https://github.com/Igmat/baset/commit/28722bc))
* **resolver-pixi:** save images in rgb without a-channel ([dfe511d](https://github.com/Igmat/baset/commit/dfe511d))
* **resolver-pixi:** use of pngjs for correct base64 strings ([1ed4e34](https://github.com/Igmat/baset/commit/1ed4e34))
* **resolver-pixi:** using data-type for resolver pixi images ([4f8a270](https://github.com/Igmat/baset/commit/4f8a270))
* **resolver-react:** using html data type for beautified baseline ([36369eb](https://github.com/Igmat/baset/commit/36369eb))
* **vm:** more correct proxy for sandboxed object ([b31a8de](https://github.com/Igmat/baset/commit/b31a8de))


### Features

* **baseliner-md:** add comparison for json, html and images in md ([832f3c9](https://github.com/Igmat/baset/commit/832f3c9))
* **baseliner-md:** initial implementation of md baseliner ([61bac7f](https://github.com/Igmat/baset/commit/61bac7f))
* **baseliner-md:** using code block for html data type ([a12595f](https://github.com/Igmat/baset/commit/a12595f))
* **core:** adding data type for html resolving ([8689b29](https://github.com/Igmat/baset/commit/8689b29))
* **core:** api for resolvers that may work with different value types ([f8ddd23](https://github.com/Igmat/baset/commit/f8ddd23))
* **resolver-pixi:** initial implementation for pixi resolver ([dd82794](https://github.com/Igmat/baset/commit/dd82794))
* **resolver-react:** initial implementation for react resolver ([43aea7a](https://github.com/Igmat/baset/commit/43aea7a))




<a name="0.8.0"></a>
# [0.8.0](https://github.com/Igmat/baset/compare/v0.7.5...v0.8.0) (2018-02-28)


### Features

* **core:** adding option to use global imports e.g. polyfills ([8871185](https://github.com/Igmat/baset/commit/8871185)), closes [#41](https://github.com/Igmat/baset/issues/41)




<a name="0.7.5"></a>
## [0.7.5](https://github.com/Igmat/baset/compare/v0.7.4...v0.7.5) (2018-02-27)


### Bug Fixes

* **env-browser:** setting jsdom window as prototype of global ([a79c38d](https://github.com/Igmat/baset/commit/a79c38d)), closes [#42](https://github.com/Igmat/baset/issues/42)




<a name="0.7.4"></a>
## [0.7.4](https://github.com/Igmat/baset/compare/v0.7.3...v0.7.4) (2018-02-26)


### Bug Fixes

* **baseliner-json:** reflect circular dependencies in baseline ([7ea8f00](https://github.com/Igmat/baset/commit/7ea8f00)), closes [#43](https://github.com/Igmat/baset/issues/43)
* **core:** don't execute functions in export ([8a06736](https://github.com/Igmat/baset/commit/8a06736)), closes [#44](https://github.com/Igmat/baset/issues/44)
* **core:** resolving circular dependencies in exports ([bb966f9](https://github.com/Igmat/baset/commit/bb966f9)), closes [#43](https://github.com/Igmat/baset/issues/43)




<a name="0.7.3"></a>
## [0.7.3](https://github.com/Igmat/baset/compare/v0.7.2...v0.7.3) (2018-02-13)


### Bug Fixes

* **vm:** check if path found like file is directory ([950bd57](https://github.com/Igmat/baset/commit/950bd57))




<a name="0.7.2"></a>
## [0.7.2](https://github.com/Igmat/baset/compare/v0.7.1...v0.7.2) (2018-02-12)


### Bug Fixes

* **vm:** allow usage of native modules in vm ([5d17b49](https://github.com/Igmat/baset/commit/5d17b49))




<a name="0.7.1"></a>
## [0.7.1](https://github.com/Igmat/baset/compare/v0.7.0...v0.7.1) (2018-02-09)


### Bug Fixes

* **core:** reverse hook order, so transformation will go right ([c9c89f8](https://github.com/Igmat/baset/commit/c9c89f8)), closes [#9](https://github.com/Igmat/baset/issues/9)




<a name="0.7.0"></a>
# [0.7.0](https://github.com/Igmat/baset/compare/v0.6.0...v0.7.0) (2018-02-09)


### Features

* **reader-babel:** initial implementation of babel reader ([44980f7](https://github.com/Igmat/baset/commit/44980f7)), closes [#7](https://github.com/Igmat/baset/issues/7)




<a name="0.6.0"></a>
# [0.6.0](https://github.com/Igmat/baset/compare/v0.5.1...v0.6.0) (2018-02-08)


### Bug Fixes

* **solution:** correct dependecies versions ([f272f03](https://github.com/Igmat/baset/commit/f272f03))
* **vm:** adding missing chdir to vm process ([32babe4](https://github.com/Igmat/baset/commit/32babe4))
* **vm:** adding missing process-uptime function ([fd66e73](https://github.com/Igmat/baset/commit/fd66e73))
* **vm:** removing readonly contextifying in order to support e2e ([11bbd17](https://github.com/Igmat/baset/commit/11bbd17))


### Features

* **core:** compiler and context arguments for plugins ([b2e4a67](https://github.com/Igmat/baset/commit/b2e4a67))
* **core:** inital support for different envs ([73ee117](https://github.com/Igmat/baset/commit/73ee117))
* **env-browser:** initial implementation with jsdom ([6f0f1f2](https://github.com/Igmat/baset/commit/6f0f1f2))
* **vm:** add baset-vm package (forked from vm2) ([0d6046b](https://github.com/Igmat/baset/commit/0d6046b))




<a name="0.5.1"></a>
## [0.5.1](https://github.com/Igmat/baset/compare/v0.5.0...v0.5.1) (2018-01-29)


### Bug Fixes

* **core:** replace all line endings with LF and trim baseline ([3d75a3e](https://github.com/Igmat/baset/commit/3d75a3e)), closes [#32](https://github.com/Igmat/baset/issues/32)
* **plugin-ts:** adding support for paths from tsconfig ([864ffdd](https://github.com/Igmat/baset/commit/864ffdd)), closes [#33](https://github.com/Igmat/baset/issues/33)




<a name="0.5.0"></a>
# [0.5.0](https://github.com/Igmat/baset/compare/v0.4.1...v0.5.0) (2018-01-26)


### Bug Fixes

* **plugin-export:** correct logic for transpiled files ([e68d09b](https://github.com/Igmat/baset/commit/e68d09b))
* **plugin-ts:** correct handling of inline options ([f0be6bd](https://github.com/Igmat/baset/commit/f0be6bd))
* **plugin-ts:** using ts-node instead of manual tsc calls ([5292042](https://github.com/Igmat/baset/commit/5292042)), closes [#6](https://github.com/Igmat/baset/issues/6)


### Features

* **plugin-ts:** initial implementation of baset-plugin-ts ([2b041ee](https://github.com/Igmat/baset/commit/2b041ee))
* **solution:** plugins architecture initial implementation ([92f598c](https://github.com/Igmat/baset/commit/92f598c)), closes [#5](https://github.com/Igmat/baset/issues/5)




<a name="0.4.1"></a>
## [0.4.1](https://github.com/Igmat/baset/compare/v0.4.0...v0.4.1) (2018-01-24)




**Note:** Version bump only for package root

<a name="0.4.0"></a>
# [0.4.0](https://github.com/Igmat/baset/compare/v0.3.0...v0.4.0) (2018-01-24)


### Features

* **Core:** Recursivly check exports to work with promises and functions ([fbf5eb0](https://github.com/Igmat/baset/commit/fbf5eb0))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/Igmat/baset/compare/v0.2.2...v0.3.0) (2018-01-23)


### Bug Fixes

* **baset/bin:** fix unix encoding ([ca67708](https://github.com/Igmat/baset/commit/ca67708))
* **CLI:** Non-zero exit code for fail and more informative message ([1aaff03](https://github.com/Igmat/baset/commit/1aaff03)), closes [#2](https://github.com/Igmat/baset/issues/2)


### Features

* **CLI:** Supporting config files and package.json section ([3eb8017](https://github.com/Igmat/baset/commit/3eb8017)), closes [#4](https://github.com/Igmat/baset/issues/4)




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




**Note:** Version bump only for package baset
