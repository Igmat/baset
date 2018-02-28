export abstract class AbstractResolver {
    abstract match: (obj: any) => Promise<boolean>;
    abstract resolve: (obj: any) => Promise<any>;
    constructor(public options: any) { }
}

export type IResolverConstructor =
    new (options: any) => AbstractResolver;
