import JSONBaseliner from 'baset-baseliner-json';
import { AbstractBaseliner, circularReference, dataTypes } from 'baset-core';
import htmlBeautify from 'html-beautify';
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
${htmlBeautify(html.src)}
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
    readonly ext = '.md';
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
                src: obj.value,
            };
            if (key !== undefined) delete parent[key];

            return [result];
        }

        return ([] as IKnownType[]).concat(...Object.keys(obj)
            .map(index => this.cutKnownTypes(obj, `${path}.${index}`, index)));
    }
}
