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
