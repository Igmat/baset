import 'pixi.js';
import { isPrimitive } from 'util';
const sprite = new PIXI.Sprite();

const data = Object
    .keys(sprite)
    .filter(key => isPrimitive(sprite[key]))
    .reduce((result, key) => ({ ...result, [key]: sprite[key] }), {});

export const value = JSON.parse(JSON.stringify(data));
