[![Known Vulnerabilities](https://snyk.io/test/npm/baset-vm/badge.svg)](https://snyk.io/test/npm/baset-vm)

# BaseT VM
> VM for [BaseT](https://github.com/Igmat/baset) project.

> **DISCLAIMER**: it was a fork of [vm2](https://github.com/patriksimek/vm2) package for internal use in baset with some functionality that is missing in original project.

> After major overwrite of this module - it's only responsibility is running code in separate `node.js` context within same proccess, so host isn't required to serialize/deserialize data from it's children. But unlike original `vm2` package it's not designed for running untrusted code - normal code won't affect host's environment in most cases but there are **NO PROGRAM RESTRICTIONS** to do it, so if you know how this context is built and which parts are actually shared between host and child you are able to affect host from child. Such decision is made, because securing host makes vm much slower, which is ok for running untrusted code, but huge overkill for running tests.

> If, for some reason, you're interested in `vm2` replacement (as I was). Create an issue in this repo - and I'll do my best to make this package `production-ready`.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
