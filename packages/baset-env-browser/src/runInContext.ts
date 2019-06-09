import { JSDOM } from 'jsdom';
declare const basetSandbox: { basetBrowserEnv__StaticUrl: string };

const dom = new JSDOM('', {
    url: basetSandbox.basetBrowserEnv__StaticUrl,
    resources: 'usable',
    pretendToBeVisual: true,

});
Object.setPrototypeOf(global, dom.window);
