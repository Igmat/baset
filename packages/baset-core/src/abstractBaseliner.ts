export abstract class AbstractBaseliner {
    abstract create: (result: Promise<any>[]) => Promise<string>;
    constructor(public options: any) { }
}

export type IBaselinerConstructor =
    new (options: any) => AbstractBaseliner;
