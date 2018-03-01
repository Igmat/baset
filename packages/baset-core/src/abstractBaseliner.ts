export abstract class AbstractBaseliner {
    readonly ext: string = '.base';
    abstract create: (result: Promise<any>[]) => Promise<string>;
    constructor(public options: any) { }
}

export type IBaselinerConstructor =
    new (options: any) => AbstractBaseliner;
