import { normalizeEndings } from './utils';

export abstract class AbstractBaseliner {
    readonly ext: string = '.base';
    abstract create: (result: Promise<any>[]) => Promise<string>;
    constructor(public options: any) { }
    compare = async (result: Promise<any>[], baseline: Promise<string>) => {
        const [newBase, oldBase] = await Promise.all([this.create(result), baseline]);

        return {
            isEqual: normalizeEndings(newBase) === normalizeEndings(oldBase),
            expected: oldBase,
            actual: newBase,
            diff: {
                console: '',
                full: '',
            },
        };
    }
}

export type IBaselinerConstructor =
    new (options: any) => AbstractBaseliner;
