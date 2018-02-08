import { CompilerFunction, ResolverFunction } from 'baset-vm';

export interface IHookOptions {
    exts?: string[];
    ignoreNodeModules?: boolean;
    matcher?(filename: string): boolean;
}
export type AddHook = (hook: CompilerFunction, options?: IHookOptions) => void;
export type AddFileResolver = (fn: (original: ResolverFunction) => ResolverFunction) => void;

export abstract class AbstractReader {
    abstract read: (filePath: string, result: Promise<string | string[]>) => Promise<string | string[]>;
    abstract registerHook: (addHook: AddHook, addFileResolver: AddFileResolver) => void;
    constructor(public options: any) { }
}

export type IReaderConstructor =
    new (options: any) => AbstractReader;
