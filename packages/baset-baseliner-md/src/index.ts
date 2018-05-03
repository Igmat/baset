import JSONBaseliner from 'baset-baseliner-json';
import { AbstractBaseliner, circularReference, dataTypes, utils } from 'baset-core';
import htmlBeautify from 'html-beautify';
import { markdown } from 'markdown';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { isPrimitive } from 'util';

interface IKnownType {
    type: typeof dataTypes.image | typeof dataTypes.html;
    name: string;
    src: string;
}
function isEmptyJsonSting(json: string) {
    return !json || json === '[]' || json === '{}';
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
${known.map(renderKnown)}
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
            ? this.cutKnownTypes(results[0], 'exports')
            : this.cutKnownTypes(results, 'exports');

        return mdTemplate(await this.jsonBaseliner.create(results), known);
    }
    compare = async (result: Promise<any>[], baseline: Promise<string>) => {
        const [results, baselineValue] = await Promise.all([Promise.all(result), baseline]);
        const known = results.length === 1
            ? this.cutKnownTypes(results[0], 'exports')
            : this.cutKnownTypes(results, 'exports');
        const oldBase = this.parse(baselineValue);
        const newJsonValues = await this.jsonBaseliner.create(results);
        let isEqual = true;
        if (utils.normalizeEndings(newJsonValues) !== utils.normalizeEndings(oldBase.json)) isEqual = false;
        if (!await compareKnownTypes(oldBase.knownEntities, known)) isEqual = false;

        return {
            isEqual,
            expected: baselineValue,
            actual: utils.normalizeEndings(mdTemplate(newJsonValues, known)),
            diff: {
                console: '',
                full: '',
            },
        };
    }
    private parse = (baseline: string) => {
        if (!baseline.trim()) return { json: '', knownEntities: [] };
        const mdTree = markdown.parse(baseline);
        const paraNodes: any[] = mdTree.slice(1);
        const json: string = (paraNodes[0][1] === 'JSON values:\n')
            ? paraNodes[0][2][1].replace(/^JSON\n/, '')
            : '{}';
        const firstKnownTypeIndex = Number(json !== '{}');
        const knownEntities: IKnownType[] = [];
        for (let i = firstKnownTypeIndex; i < paraNodes.length; i += 2) {
            const type = paraNodes[i + 1][1][0] === 'img'
                ? dataTypes.image
                : dataTypes.html;
            const name = paraNodes[i][1][1].replace(':', '');
            const src = (type === dataTypes.image)
                ? paraNodes[i + 1][1][1].href
                : paraNodes[i + 1][1][1].replace(/^HTML\n/, '');
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

    private cutKnownTypes = (parent: any, path: string, key?: string | number): IKnownType[] => {
        const obj = (key !== undefined)
            ? parent[key]
            : parent;
        if (isPrimitive(obj)) return [];
        if (Array.isArray(obj)) {
            return ([] as IKnownType[]).concat(
                ...obj.map((value, index) =>
                    this.cutKnownTypes(obj, `${path}[${index}]`, index)));
        }
        const type = obj[dataTypes.image]
            ? dataTypes.image
            : obj[dataTypes.html]
                ? dataTypes.html
                : false;
        if (type) {
            const result: IKnownType = {
                type,
                name: path,
                src: (type === dataTypes.html)
                    ? htmlBeautify(obj.value)
                    : obj.value,
            };
            if (key !== undefined) delete parent[key];

            return [result];
        }

        return ([] as IKnownType[]).concat(...Object.keys(obj)
            .map(index => this.cutKnownTypes(obj, `${path}.${index}`, index)));
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
        if (value.type === dataTypes.image) {
            if (!await compareImages(value.src, newValue.src)) return false;
        } else {
            if (utils.normalizeEndings(value.src) !== utils.normalizeEndings(newValue.src)) return false;
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
