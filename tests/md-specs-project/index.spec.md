# init
To initialize use:
```TypeScript
import { sampleFn } from './index';
```
or
```TypeScript
const { sampleFn } = require('./index');
```
## usage
First example:
```TypeScript
export const numberValue = sampleFn(1, 1);
```
Second example and:
```TypeScript
export const numberValue = sampleFn(1000000, 1000000);
```
### specific usage
```TypeScript
export const values = [
    sampleFn('abc', 'cba'),
    sampleFn(1, 'abc'),
]
```
### second specific usage
```TypeScript
export const values = [
    sampleFn('abc', 1),
]
```
## corner cases
First example:
```TypeScript
export const value = () => sampleFn('function call', 1);
```
Second example
```TypeScript
export const value = new Promise(resolve => resolve(sampleFn('async value', 1)));
```
