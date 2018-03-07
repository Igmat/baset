import { IDictionary } from './utils';

export abstract class AbstractEnvironment {
    constructor(public options: any) { }
    abstract getContextImport(sandbox: IDictionary<any>): string;
    abstract dispose(): void;
}

export type IEnvironmentConstructor =
    new (options: any) => AbstractEnvironment;
