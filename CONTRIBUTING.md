# How to Contribute

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Helpful things](#helpful-things)
- [Creating Issues](#creating-issues)
  - [Bug Issues](#bug-issues)
- [Developing](#developing)
  - [Initializing](#initializing)
  - [Building](#building)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Helpful things

We're open source! We love contributions! An ordered list of helpful things:

1. Patches with tests
2. Bare patches
3. Failing tests
4. Bug reports
5. Problem statements
6. Feature requests


## Creating Issues
GitHub issues can be treated like a massive, communal todo list. If you notice something wrong, toss an issue in and we'll get to it!


### Bug Issues
* The following things are helpful
    * js console or node logs
* The following things should always be included
    * the steps it would take to reproduce the issue
    * what happened when you followed those steps
    * what you expected to happen that didn't

## Developing
* Please follow linter warnings.
* Optionally, add tests, we'd like to hit 100% code coverage.
* We're using [commitizen](https://github.com/commitizen/cz-cli), so run `git cz` or `npm run commit` instead of usual commits for this repo.
* Please write meaningful commit messages. Keep them somewhat short and meaningful. Commit messages like “meh”, “fix”, “lol” and so on are useless. Your are writing to your future self and everyone else. It’s important to be able to tell what a commit is all about from its message.

    “Write every commit message like the next person who reads it is an axe-wielding maniac who knows where you live”

* Thank you for contributing!

### Initializing
For initializing just run:
```
npm install
```
If you'll run only tasks from package.json you'll need no global dependency for developing this project.

### Building
To build project run:
```
npm run build
```
or for watching:
```
npm run watch
```
