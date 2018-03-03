import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export const writeFile = promisify(fs.writeFile);
export const readFile = promisify(fs.readFile);
export const isExists = promisify(fs.exists);
export const unlink = promisify(fs.unlink);

export interface IDictionary<T> {
    [index: string]: T;
}

export function pathToTmp(value: string) {
    const ext = path.extname(value);

    return value.replace(new RegExp(`${ext}$`), `.tmp${ext}`);
}
export function tmpToPath(value: string) {
    return value.replace(/.tmp./, '.');
}

export function normalizeEndings(value: string) {
    return value.replace(/\r?\n|\r/g, '\n').trim();
}
