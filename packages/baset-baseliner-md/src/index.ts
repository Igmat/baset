import JSONBaseliner from 'baset-baseliner-json';
import { AbstractBaseliner, circularReference, dataTypes } from 'baset-core';
import { isPrimitive } from 'util';
interface IImageProperty {
    name: string;
    src: string;
}
function isEmptyJsonSting(json: string) {
    return !json || json === '[]' || json === '{}';
}

const imageTemplate = (image: IImageProperty) => `
\`${image.name}:\`

![${image.name}](${image.src})
`;
const jsonTemplate = (json: string) => `
JSON values:
\`\`\`JSON
${json}
\`\`\`
`;
const mdTemplate = (json: string, images: IImageProperty[]) => `
${!isEmptyJsonSting(json) ? jsonTemplate(json) : ''}
${images.map(imageTemplate)}
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
        const images = results.length === 1
            ? this.cutImages(results[0], 'exports')
            : this.cutImages(results, 'exports');

        return mdTemplate(await this.jsonBaseliner.create(results), images);
    }

    private cutImages = (parent: any, path: string, key?: string | number): IImageProperty[] => {
        const obj = (key !== undefined)
            ? parent[key]
            : parent;
        if (isPrimitive(obj)) return [];
        if (Array.isArray(obj)) {
            return ([] as IImageProperty[]).concat(
                ...obj.map((value, index) =>
                    this.cutImages(obj, `${path}[${index}]`, index)));
        }
        if (obj[dataTypes.image]) {
            const result = {
                name: path,
                src: obj.value,
            };
            if (key !== undefined) delete parent[key];

            return [result];
        }

        return ([] as IImageProperty[]).concat(...Object.keys(obj)
            .map(index => this.cutImages(obj, `${path}.${index}`, index)));
    }
}
