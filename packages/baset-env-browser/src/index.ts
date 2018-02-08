import { AbstractEnvironmet } from 'baset-core';
import { JSDOM } from 'jsdom';

const dom = new JSDOM();
Object.assign(global, dom.window);

export default class BrowserEnv extends AbstractEnvironmet {
}
