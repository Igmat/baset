declare interface beautify {
    (value: any, replacer?: (key: string, value: any) => any, space?: string | number, maxWidth?: number): string;
}
declare const beautify: beautify;
export = beautify;
