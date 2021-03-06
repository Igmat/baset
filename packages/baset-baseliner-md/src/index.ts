import JSONBaseliner from 'baset-baseliner-json';
import { AbstractBaseliner, circularReference, dataTypes, utils } from 'baset-core';
import { clean } from 'clean-html';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import markdown from 'remark-parse';
import unified from 'unified';
import { isPrimitive } from 'util';
const processor = unified()
    .use(markdown, { commonmark: true });

function markdownParse(src: string) {
    return processor.parse(src);
}

async function htmlBeautify(src: string) {
    return new Promise(resolve => clean(src, resolve));
}
type Values<T> = T[keyof T];
interface IKnownType {
    type: Values<typeof dataTypes>;
    name: string;
    originalValue?: any;
    src: string;
}
function uglifyJson(json: string) {
    return utils.normalizeEndings(json).split('\n').map(line => line.trim()).join('');
}
function isEmptyJsonSting(json: string) {
    return !json || json === '[]' || json === '{}' || uglifyJson(json) === '{"default": {}}';
}

function normalizeStackTrace(trace: string) {
    const filePathRegex = path.sep === '\\'
        ? /([a-z]|[A-Z]):\\[^:]*:/g
        : /\/[^:]*:/g;

    return trace.replace(
        filePathRegex,
        absPath =>
            path.relative(process.cwd(), absPath)
                .replace(/\\/g, '/'),
    );
}

const knownTypeTemplates = {
    [dataTypes.image]: (image: IKnownType) => `
![${image.name}](${image.src})
`,
    [dataTypes.html]: (html: IKnownType) => `
\`\`\`HTML
${html.src}
\`\`\`
`,
    [dataTypes.error]: (error: IKnownType) => `
\`\`\`
${normalizeStackTrace(error.src)}
\`\`\`
`,
};
const renderKnown = (property: IKnownType) => `
\`${property.name}:\`
${knownTypeTemplates[property.type](property)}
`;
const renderJson = (json: string) => `
JSON values:
\`\`\`JSON
${json}
\`\`\`
`;

const mdTemplate = (json: string, known: IKnownType[]) => `
${!isEmptyJsonSting(json) ? renderJson(json) : ''}
${known.map(renderKnown).join('')}
`;

export default class MDBaseliner extends AbstractBaseliner {
    readonly ext = '.base.md';
    private jsonBaseliner: JSONBaseliner;
    constructor(options: any) {
        super(options);
        this.jsonBaseliner = new JSONBaseliner({});
    }
    create = async (result: Promise<any>[]) => {
        const results = await Promise.all(result);
        const known = results.length === 1
            ? await this.cutKnownTypes(results[0], 'exports')
            : await this.cutKnownTypes(results, 'exports');

        return mdTemplate(await this.jsonBaseliner.create(results), known);
    }
    compare = async (result: Promise<any>[], baseline: Promise<string>) => {
        const [results, baselineValue] = await Promise.all([Promise.all(result), baseline]);
        const known = results.length === 1
            ? await this.cutKnownTypes(results[0], 'exports')
            : await this.cutKnownTypes(results, 'exports');
        const oldBase = this.parse(baselineValue);
        const newJsonValues = await this.jsonBaseliner.create(results);
        const newJson = (isEmptyJsonSting(newJsonValues))
            ? '{}'
            : newJsonValues;
        let isEqual = true;
        if (utils.normalizeEndings(newJson) !== utils.normalizeEndings(oldBase.json)) isEqual = false;
        if (!await compareKnownTypes(oldBase.knownEntities, known)) isEqual = false;

        return {
            isEqual,
            expected: baselineValue,
            actual: utils.normalizeEndings(mdTemplate(newJsonValues, known)),
            errors: known
                .filter(({ type }) => type === dataTypes.error)
                .map(({ originalValue }) => originalValue[dataTypes.error]),
            diff: {
                console: '',
                full: '',
            },
        };
    }
    private parse = (baseline: string) => {
        if (!baseline.trim()) return { json: '', knownEntities: [] };
        const mdTree = markdownParse(baseline);
        const nodes: any[] = mdTree.children;
        const json: string = (nodes[0].children[0].value === 'JSON values:')
            ? nodes[1].value
            : '{}';
        const firstKnownTypeIndex = Number(json !== '{}') * 2;
        const knownEntities: IKnownType[] = [];
        for (let i = firstKnownTypeIndex; i < nodes.length; i += 2) {
            const name = nodes[i].children[0].value.replace(':', '');
            const type = name.endsWith('Throws')
                ? dataTypes.error
                : nodes[i + 1].type === 'paragraph'
                    ? dataTypes.image
                    : dataTypes.html;
            const src = (type === dataTypes.image)
                ? nodes[i + 1].children[0].url
                : nodes[i + 1].value;
            knownEntities.push({
                name,
                type,
                src,
            });
        }

        return {
            json,
            knownEntities,
        };
    }

    private cutKnownTypes = async (parent: any, path: string, key?: string | number): Promise<IKnownType[]> => {
        const obj = (key !== undefined)
            ? parent[key]
            : parent;
        if (isPrimitive(obj)) return [];
        if (Array.isArray(obj)) {
            return ([] as IKnownType[]).concat(
                ...await Promise.all(obj.map((value, index) =>
                    this.cutKnownTypes(obj, `${path}[${index}]`, index))));
        }
        const type = getType(obj);
        if (type) {
            const result: IKnownType = {
                type,
                originalValue: obj,
                name: type === dataTypes.error
                    ? `${path} Throws`
                    : path,
                src: (type === dataTypes.html)
                    ? obj[dataTypes.html] === 'react'
                        ? obj.value
                        : await htmlBeautify(obj.value)
                    : type === dataTypes.error
                        ? obj[type].stack
                        : obj.value,
            };
            if (key !== undefined) delete parent[key];

            return [result];
        }

        return ([] as IKnownType[]).concat(
            ...await Promise.all(Object.keys(obj)
                .map(index => this.cutKnownTypes(obj, `${path}.${index}`, index))));
    }
}

async function compareKnownTypes(oldBase: IKnownType[], newBase: IKnownType[]) {
    const sortedOldBase = oldBase.sort(sortKnownTypes);
    const sortedNewBase = newBase.sort(sortKnownTypes);
    for (let i = 0; i < sortedOldBase.length; i++) {
        const value = sortedOldBase[i];
        const newValue = sortedNewBase[i];
        if (newValue === undefined) return false;
        if (value.type !== newValue.type) return false;
        switch (value.type) {
            case dataTypes.image:
                if (!await compareImages(value.src, newValue.src)) return false;
                break;
            case dataTypes.html:
                if (utils.normalizeEndings(value.src) !== utils.normalizeEndings(newValue.src)) return false;
                break;
            case dataTypes.error:
                if (utils.normalizeEndings(value.src) !== utils.normalizeEndings(normalizeStackTrace(newValue.src))) return false;
                break;
            default:
                break;
        }
    }

    return true;
}

async function compareImages(a: string, b: string) {
    // base64 strings are platform dependent and differs on win and *nix
    // so we'll have to match them pixel by pixel
    const [imageA, imageB] = await Promise.all([base64ToPNG(a), base64ToPNG(b)]);
    if (imageA.width !== imageB.width || imageA.height !== imageB.height) return false;

    return pixelmatch(imageA.data, imageB.data, null, imageA.width, imageA.height, {
        threshold: 0,
    }) === 0;
}

const base64prefix = 'data:image/png;base64,';
async function base64ToPNG(base64String: string) {
    return new Promise<PNG>(async (resolve, reject) => {
        const imgBuffer = new Buffer(base64String.replace(base64prefix, ''), 'base64');
        const png = new PNG();
        png.parse(imgBuffer, err => (!err)
            ? resolve(png)
            : reject(err));
    });
}

function sortKnownTypes(a: IKnownType, b: IKnownType) {
    return a.name > b.name
        ? 1
        : a.name < b.name
            ? -1
            : 0;
}
function getType(obj: any) {
    return (Object.keys(dataTypes) as (keyof typeof dataTypes)[])
        .map(key => dataTypes[key])
        .find(type => !!obj[type]);
}
