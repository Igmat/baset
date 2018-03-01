import { AbstractEnvironmet } from 'baset-core';
import { ConstructorOptions, JSDOM } from 'jsdom';

// FIXME: seems like jsdom.d.ts is incorrect and `pretendToBeVisual` is missing
// tslint:disable-next-line:no-object-literal-type-assertion
const dom = new JSDOM('', {
    resources: 'usable',
    pretendToBeVisual: true,
} as ConstructorOptions);
Object.setPrototypeOf(global, dom.window);

export default class BrowserEnv extends AbstractEnvironmet {
}
