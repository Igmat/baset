export abstract class AbstractEnvironmet {
    constructor(public options: any) { }
}

export type IEnvironmentConstructor =
    new (options: any) => AbstractEnvironmet;
