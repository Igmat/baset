import { ConstructorOptions, JSDOM } from 'jsdom';
declare const basetSandbox: { basetBrowserEnv__StaticUrl: string };

// FIXME: seems like jsdom.d.ts is incorrect and `pretendToBeVisual` is missing
// tslint:disable-next-line:no-object-literal-type-assertion
const dom = new JSDOM('', {
    url: basetSandbox.basetBrowserEnv__StaticUrl,
    resources: 'usable',
    pretendToBeVisual: true,
} as ConstructorOptions);
Object.setPrototypeOf(global, dom.window);
