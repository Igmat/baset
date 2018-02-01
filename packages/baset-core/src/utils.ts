import * as fs from 'fs';
import { promisify } from 'util';

export const writeFile = promisify(fs.writeFile);
export const readFile = promisify(fs.readFile);
export const isExists = promisify(fs.exists);
export const unlink = promisify(fs.unlink);

export interface IDictionary<T> {
    [index: string]: T;
}
