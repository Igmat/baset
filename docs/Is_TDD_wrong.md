# Is TDD wrong?

> **DISCLAIMER:** your attention was captured by clickbait. Obviously, TDD isn’t wrong, but… There is always some ‘but’.

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Introduction](#introduction)
- [Problem is tests!](#problem-is-tests)
  - [A little bit of history](#a-little-bit-of-history)
  - [Small Quiz](#small-quiz)
- [TDD overview](#tdd-overview)
  - [Tests are formalized requirements](#tests-are-formalized-requirements)
  - [TDD forces good architecture](#tdd-forces-good-architecture)
  - [TDD saves time](#tdd-saves-time)
  - [Tests are the best documentation](#tests-are-the-best-documentation)
  - [As an intermediate conclusion](#as-an-intermediate-conclusion)
- [So what's the solution?](#so-whats-the-solution)
    - [Some samples](#some-samples)
    - [Plans](#plans)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

First six years of my career I was freelancing and participating in small start-ups at initial phase. So no tests… Really, not single one.

In such circumstances you have to deliver features for ‘yesterday’. Because market requirements constantly changing, test will be obsolete, when you’ll finish them. And even these tests can be created only if you know what you want to develop, and it’s not always true. Doing R&D you may don’t know what your final goal is. And when you reach some point, you can’t be sure that it won’t dramatically change tomorrow. In fact there are business reasons to save time by avoiding unit-testing.

Ok, our industry is much larger than just start-ups.  
Nearly 2 years ago I was hired by pretty big outsourcing company that has clients of any sizes.  
During kitchen-talks with my colleagues, I’ve discovered that mostly everybody agrees that unit-testing and TDD is kind of ‘best practice’.  But in all projects where I was participating, there were no tests. And not, it wasn’t my decision. Yes, I know that there are projects that has good test coverage. There are such projects in my company too. But those well tested project also heavily bureaucratized.

So what’s the problem?  
Why everybody agrees that TDD is good, but nobody actually follows it?  
Is TDD wrong? – No!  
Probably, it has no business value? – And again, no!  
Are developers lazy? – Yes! But it’s not a reason.  
Problem is tests themselves!  
Yes, it sounds weird, but I’ll try to prove it. 

## Problem is tests!
According to [this survey](https://stateofjs.com/) `Testing Tools` had the lowest overall happiness score in 2016 and 2017. I didn’t find similar earlier information, but it doesn’t really matter.

### A little bit of history
In 2008th one of the firsts test frameworks ([QUnit](https://qunitjs.com/)) was released.  
In 2010 Jasmine appeared.  
In 2011 – Mocha.  
First release which I found for Jest was in 2014.

![timeline-for-test-tools](./images/timeline-for-test-tools.svg)

For comparison.  
In 2010 angular was released.  
Ember was introduced in 2011.  
react appeared in 2013.  
And so on…

> No js frameworks was created during preparation for this topic...  
At least by me.

![timeline-for-frameworks-and-libraries](./images/timeline-for-frameworks-and-libraries.svg)

At same period of time we’ve seen rise and fall of grunt, then gulp. After that we’ve realized the power of npm scripts and webpack was released.

![timeline-for-tooling](./images/timeline-for-tooling.svg)

Everything changed during last 10 years. Everything except testing.

### Small Quiz
Let’s check your knowledge. What library/framework is it?  
1:
```JavaScript
var hiddenBox = $("#banner-message");
$("#button-container button").on("click", function(event) {
    hiddenBox.show();
});
```
2:  
```TypeScript
@Component({
    selector: 'app-heroes',
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.css']
})
export class HeroesComponent{
    hero: Hero = {
        id: 1,
        name: 'Windstorm'
    };

    constructor() { }
}
```
3:  
```JavaScript
function Avatar(props) {
    return (
        <img className="Avatar"
             src={props.user.avatarUrl}
             alt={props.user.name}
        />
    );
}
```
Answers:  
1. [JQuery](https://jquery.com/)
2. [Angular2+](https://angular.io/)
3. [React](https://reactjs.org/)

Ok, good. I'm pretty sure that your answers were correct in all cases. But what about test frameworks?  
1:  
```JavaScript
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});
```
2:  
```JavaScript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```
3:  
```JavaScript
test('timing test', function (t) {
    t.plan(2);
    
    t.equal(typeof Date.now, 'function');
    var start = Date.now();
    
    setTimeout(function () {
        t.equal(Date.now() - start, 100);
    }, 100);
});
```
4:  
```JavaScript
let When2IsAddedTo2Expect4 = 
    Assert.AreEqual(4, 2+2)
```
Answers:  
1. [Mocha](https://mochajs.org/)
2. [Jest](https://facebook.github.io/jest/)
3. [Tape](https://github.com/substack/tape)
4. [Test for F#](http://fsharp.org/)

You may guess some answers, but in general all these tools are very similar. You may see that even in different languages things remain mostly the same.

So we have at least 8 years experience with unit-testing in JavaScript world. 
But we just adapted something already existing at that point of time. Unit-testing as we know it appeared much earlier. If we will take release of [Test Anything Protocol](https://en.wikipedia.org/wiki/Test_Anything_Protocol) (1987) as starting point, then we use existing approach longer than I live.

[TDD](https://en.wikipedia.org/wiki/Test-driven_development) itself isn't much younger than automated unit-testing, [if not older](https://www.quora.com/Why-does-Kent-Beck-refer-to-the-rediscovery-of-test-driven-development-Whats-the-history-of-test-driven-development-before-Kent-Becks-rediscovery). It brings us to the point where we can properly assess its pros and cons.

## TDD overview
In order to be at the page same, let me remind you what is TDD.

> Test-driven development (TDD) is a software development process that relies on the repetition of a very short development cycle: requirements are turned into very specific test cases, then the software is improved to pass the new tests, only.

![tdd-cycle](./images/tdd-cycle.svg)

But what do we benefit from using it?

### Tests are formalized requirements
Actually it's true only partially.

TDD as practice was "rediscovered" by Kent Beck in 1999, while [Agile Manifesto](http://agilemanifesto.org/) was accepted only 2 years later (in 2001). I have to mention it in order to make you understand that TDD was born in "Golden Age" of [waterfall model](https://en.wikipedia.org/wiki/Waterfall_model) and this fact determines the circumstances and processes for which it was designed. Obviously, TDD will work best in exactly such cases.

So, if you work in project, where:

1. Requirements are clear;
2. You fully understand them;
3. They are stable and won't be changed frequently.

You may create tests that will act as formalized requirements.  
But in order to treat _existing_ tests in same manner, following statements has to be true too:

1. Tests don't have bugs;
2. They are up to date;
3. And they cover nearly all use cases (don't confuse with code coverage).

So **"Tests are formalized requirements"** is true only in case of existing those requirements _before_ actual development, like in "Waterfall model" or [NASA](https://www.nasa.gov/) projects, where "customers" are scientists/engineers.

> In some circumstances it may work in "Agile" process as well. Especially if workaround like [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) is used, but that's another story.

### TDD forces good architecture
And again it's true only partially.  
TDD forces modularity, which is necessary but not sufficient for good architecture.

Architecture quality depends on developers. Experienced developers are able to write high-quality code regardless of whether or not unit-testing is used.  
On the other hand, semiskilled developers will produce low-quality code covered by low-quality tests, because creating good tests is an art form, as well as programming itself.

Yes, tests like sex: "better bad than none at all". But...  
This test doesn't bring you closer to good system design:
```TypeScript
import { inject, TestBed } from '@angular/core/testing';

import { UploaderService } from './uploader.service';

describe('UploaderService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UploaderService],
        });
    });

    it('should be created', inject([UploaderService], (service: UploaderService) => {
        expect(service).toBeTruthy();
    }));
});
```
Because, it actually doesn't test anything.
> And we used 15 lines of code to test nothing.

But next test also won't make your architecture better:
```JavaScript
var IotSimulation = artifacts.require("./IotSimulation.sol");
var SmartAsset = artifacts.require("./SmartAsset.sol");
var BuySmartAsset = artifacts.require("./BuySmartAsset.sol");

var BigInt = require('big-integer');

contract('BuySmartAsset', function (accounts) {

    it("Should sell asset", async () => {
        var deliveryCity = "Lublin";

        var extra = 1000; //
        var gasPrice = 100000000000;


        const smartAsset = await SmartAsset.deployed();
        const iotSimulation = await IotSimulation.deployed();
        const buySmartAsset = await BuySmartAsset.deployed()

        const result = await smartAsset.createAsset(Date.now(), 200, "docUrl", 1, "email@email1.com", "Audi A8", "VIN02", "black", "2500", "car");
        const smartAssetGeneratedId = result.logs[0].args.id.c[0];

        await iotSimulation.generateIotOutput(smartAssetGeneratedId, 0);
        await iotSimulation.generateIotAvailability(smartAssetGeneratedId, true);
        await smartAsset.calculateAssetPrice(smartAssetGeneratedId);

        const assetObjPrice = await smartAsset.getSmartAssetPrice(smartAssetGeneratedId);
        assert.isAbove(parseInt(assetObjPrice), 0, 'price should be bigger than 0');

        await smartAsset.makeOnSale(smartAssetGeneratedId);

        var assetObj = await smartAsset.getAssetById.call(smartAssetGeneratedId);
        assert.equal(assetObj[9], 3, 'state should be OnSale = position 3 in State enum list');

        await smartAsset.makeOffSale(smartAssetGeneratedId);
        assetObj = await smartAsset.getAssetById.call(smartAssetGeneratedId);
        assert.equal(assetObj[9], 2, 'state should be PriceCalculated = position 2 in State enum list');

        await smartAsset.makeOnSale(smartAssetGeneratedId);

        const calculatedTotalPrice = await buySmartAsset.getTotalPrice.call(smartAssetGeneratedId, '112', '223');
        await buySmartAsset.buyAsset(smartAssetGeneratedId, '112', '223', { from: accounts[1], value: BigInt(calculatedTotalPrice.toString()).add(BigInt(extra)) });

        assetObj = await smartAsset.getAssetById.call(smartAssetGeneratedId);
        assert.equal(assetObj[9], 0, 'state should be ManualDataAreEntered = position 0 in State enum list');
        assert.equal(assetObj[10], accounts[1]);

        const balanceBeforeWithdrawal = await web3.eth.getBalance(accounts[1]);
        const gas = await buySmartAsset.withdrawPayments.estimateGas({ from: accounts[1] });
        await buySmartAsset.withdrawPayments({ from: accounts[1], gasPrice: gasPrice });

        const balanceAfterWithdrawal = await web3.eth.getBalance(accounts[1]);

        var totalGas = gas * gasPrice;

        assert.isOk((BigInt(balanceAfterWithdrawal.toString()).add(BigInt(totalGas))).eq(BigInt(balanceBeforeWithdrawal.toString()).add(BigInt(extra))));
    })
})
```
Biggest problem of this test is initial code base, but it could be greatly improved even without refactoring of already working project.

Actually TDD's impact on resulting architecture is approximately on same level as impact of chosen framework/library, if not less (e.g. [Nest](https://nestjs.com/), [RxJs](https://github.com/Reactive-Extensions/RxJS) and [MobX](https://github.com/mobxjs/mobx) IMO have much bigger impact than TDD).

But neither TDD nor frameworks will prevent anybody from writing poor-quality code and making bad design choices.

> There is no **silver bullet**.

### TDD saves time
Ok, it depends.  
Let's assume that everybody in project is confident enough with chosen test framework, TDD methodology and best practices of unit-testing.  
And there are no misunderstood in all this stuff.  
And requirements are clear and stable.  
And developers team understands them in same manner as product owner.  
And management is ready to handle all organizational issues, caused by it (e.g. longer onboarding for new programmers).

Even in this case, you'll have to invest some efforts first, which will increase initial development phase and only later you'll get it back by decreasing time spent for bugfixing and maintenance.  
Yes, second could probably be bigger than first. In this case you'll get some profit from TDD.  
In some cases you'll also save time while implementing new features, because test will show unintentional breaking changes.  
But in real world, which is very dynamic, requirements may change and something that was valid before will become invalid. In this case you'll have to rewrite tests according to new reality. And, obviously, spend new efforts, that won't be paid back immediately.

You may even be caught by such kind of cycle:

![tdd-cycle-for-changes-wrong](./images/tdd-cycle-for-changes-wrong.svg)

Ok, this cycle doesn't fully follows TDD principles. But next does:

![tdd-cycle-for-changes-right](./images/tdd-cycle-for-changes-right.svg)

Try to find important differences.

### Tests are the best documentation
No. It's good, but definitely not the best.

Let's take a look at [angular docs](https://angular.io/docs):
![angular-docs-screenshot](./images/angular-docs-screenshot.png)

Or [react docs](https://reactjs.org/docs/):
![react-docs-screenshot](./images/react-docs-screenshot.png)

What do you think they have in common? - They both are built around **code samples**. And even more. All this samples are easily runnable (angular uses [StackBlitz](https://stackblitz.com) and react - [CodePen](https://codepen.io)), so you are able to see output and what happens if you change something.  
Of course, they also have some text content, but it's like comments in code - you need them only if you don't understand something in underlying code.

_**Runnable code samples**_ is the best documentation!

Tests are close to this, but they aren't just executable code samples.
```TypeScript
describe('ReactTypeScriptClass', function() {
  beforeEach(function() {
    container = document.createElement('div');
    attachedListener = null;
    renderedName = null;
  });

  it('preserves the name of the class for use in error messages', function() {
    expect(Empty.name).toBe('Empty');
  });

  it('throws if no render function is defined', function() {
    expect(() =>
      expect(() =>
        ReactDOM.render(React.createElement(Empty), container)
      ).toThrow()
    ).toWarnDev([
      // A failed component renders twice in DEV
      'Warning: Empty(...): No `render` method found on the returned ' +
        'component instance: you may have forgotten to define `render`.',
      'Warning: Empty(...): No `render` method found on the returned ' +
        'component instance: you may have forgotten to define `render`.',
    ]);
  });
```
It's a small part from [real react test](https://github.com/facebook/react/blob/master/packages/react/src/__tests__/ReactTypeScriptClass-test.ts). We may separate code samples from it:
```TypeScript
container = document.createElement('div');
Empty.name;
```
```TypeScript
container = document.createElement('div');
ReactDOM.render(React.createElement(Empty), container);
```
Everything else is manually created infrastructure code for testing.

Let's be honest, previous test sample is far less readable than real docs. And problem isn't in this particular test - I believe guys from [facebook](https://www.facebook.com/) know how to write good code and good tests :) All this stuff from testing tools and assertion libraries, like `it`, `describe`, `test`, `to.be.true` just blows up your test suites.

> There is a library called [tape](https://github.com/substack/tape) with minimal API, because any test can be rewritten using only `equal`/`deepEqual` and thinking in this terms is generally good practice for unit-testing. But even `tape`'s tests are far away from being just **executable code samples**.

But I have to admit that it definitely usable as documentation. It really less likely to be outdated, and on the other hand our minds just throw away everything unimportant, while reading tests. If we try to visualize our thoughts in that moment, we get something like this:
![test-as-doc-example](./images/test-as-doc-example.png)

As you can see - it's much closer to real docs than initial test.

### As an intermediate conclusion

1. **Tests are formalized requirements** if they are stable;
2. **TDD forces good architecture** if developers are qualified enough;
3. **TDD saves time** if you invest it first;
4. **Tests are the best documentation** if there are no other executable code samples.

So TDD is wrong, isn't it? - No, TDD isn't wrong.  
It shows right direction and raises important questions. We just have to rethink and change the way we apply it.

## So what's the solution?
Don't treat TDD as silver bullet.  
Don't treat it even as a process on same level as Agile for example.  
Instead focus on its real strengths:

1. Preventing unintentional breaking changes, in other words freezing existing behavior as some sort of 'baseline';
2. Using documentation samples as tests.

Think of unit-testing as a developer's tool. Like [linter](https://eslint.org/) or [compiler](https://www.typescriptlang.org/).

> For example, you won't ask Product Owner about using linter - instead you'll just use it.

Someday it will be true for unit-testing too. When efforts required for TDD will be somewhere around using [typechecker](https://flow.org/) or [bundler](https://webpack.js.org/). But until that moment just minimize your efforts by writing tests as close as possible to **executable samples** and use them as **current baseline** of project's state.

I understand that it will be difficult, especially while most of well-known tools aren't designed for such approach.

Actually, I developed one, taking into account all the problems described. It called

[![BaseT](./images/logo.svg)](https://github.com/Igmat/baset)

Base concept is very simple. Write your code:
```TypeScript
export function sampleFn(a: any, b: any) {
    return a + b + b + a;
}
```
And just use it in your test file:
```TypeScript
import { sampleFn } from './index';

export = {
    values: [
        sampleFn(1, 1),
        sampleFn(1000000, 1000000),
        sampleFn('abc', 'cba'),
        sampleFn(1, 'abc'),
        sampleFn('abc', 1),
        new Promise(resolve => resolve(sampleFn('async value', 1))),
    ],
};
```
> **NOTE:** test is very synthetic, just for demonstration purposes.

Then run `baset test` and get your temporary baseline:
```JSON
{
    "values": [
        4,
        4000000,
        "abccbacbaabc",
        "1abcabc1",
        "abc11abc",
        "async value11async value"
    ]
}
```
If values are correct, just run `baset accept` and commit newly created baseline to your repository.

All next test runs will compare existing **baseline** with values exported from your test files. If they differ, then test is failed, otherwise it's passed.  
If requirements changed, just change your code run tests and accept **new baseline**.

This tool still prevents any unintentional breaking changes, while minimizing your efforts. And all you need to do is write **executable code samples**, which are the core of good documentation.

#### Some samples
You may use it with react. This test:
```TypeScript
import * as React from 'react';
import { jsxFn } from './index';

export const value = (
    <div>
        {jsxFn('s', 's')}
        {jsxFn('abc', 'cba')}
        {jsxFn('s', 'abc')}
        {jsxFn('abc', 's')}
    </div>
);
```
will produce following `.md` file as **baseline**:

---
`exports.value:`

```HTML
<div data-reactroot="">
    <div class="cssCalss">
        ss
    </div>
    <div class="cssCalss">
        abccba
    </div>
    <div class="cssCalss">
        sabc
    </div>
    <div class="cssCalss">
        abcs
    </div>
</div>
```

---
Or with [pixi.js](http://www.pixijs.com/):
```TypeScript
import 'pixi.js';
interface IResourceDictionary {
    [index: string]: PIXI.loaders.Resource;
}

const ASSETS = './assets/assets.json';
const RADAR_GREEN = 'Light_green';

const getSprite = async () => {
    await new Promise(resolve => PIXI.loader
        .add(ASSETS)
        .load(resolve));

    return new PIXI.Sprite(PIXI.utils.TextureCache[RADAR_GREEN]);
};

export const sprite = getSprite();
```
This test will produce following **baseline**:

---
`exports.sprite:`

![exports.sprite](./images/sprite-export-sample.png)

---

#### Plans
I have to mention that this tool is in early beta and there are a lot of plans for it, like:

1. [Watch/Workflow mode](https://github.com/Igmat/baset/issues/65)
2. [TAP compatibility](https://github.com/Igmat/baset/issues/55)
3. [Git acceptance strategy](https://github.com/Igmat/baset/issues/69)
4. [VS Code extension](https://github.com/Igmat/baset/issues/74)
5. ...and at least 24 others.

Only about 40% of planned features for first stable release are implemented. But core stuff already works, so you may play with it. You may even like it. Who knows?
