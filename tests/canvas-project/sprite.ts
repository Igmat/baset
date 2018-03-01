import 'pixi.js';
interface IResourceDictionary {
    [index: string]: PIXI.loaders.Resource;
}

const mainLoader = new PIXI.loaders.Loader();
mainLoader.add('baset', './assets/abstract-baset.jpg');
const assets = new Promise<IResourceDictionary>(resolve =>
    mainLoader.load((loader: PIXI.loaders.Loader, resource: IResourceDictionary) =>
        resolve(resource)));

async function getSprite() {
    const resource = await assets;

    return PIXI.Sprite.from(resource.baset.data);
}
export const sprite = getSprite();
