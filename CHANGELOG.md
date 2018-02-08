# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
