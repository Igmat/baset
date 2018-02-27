import { AbstractEnvironmet } from 'baset-core';
import { JSDOM } from 'jsdom';

const dom = new JSDOM();
Object.setPrototypeOf(global, dom.window);

export default class BrowserEnv extends AbstractEnvironmet {
}
