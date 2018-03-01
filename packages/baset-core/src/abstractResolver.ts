import { NodeVM } from 'baset-vm';
import { IDictionary } from './utils';

export abstract class AbstractResolver {
    abstract match: (obj: any, context: NodeVM, sandbox: IDictionary<any>) => Promise<boolean>;
    abstract resolve: (obj: any, context: NodeVM, sandbox: IDictionary<any>) => Promise<any>;
    constructor(public options: any) { }
}

export type IResolverConstructor =
    new (options: any) => AbstractResolver;
