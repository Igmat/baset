import { AbstractReader, utils } from 'baset-core';
import { markdown } from 'markdown';

interface INode {
    index: number;
    name: string;
    level: number;
}
interface IRoot extends INode {
    codeBlocks: string[];
}
interface ISection extends IRoot {
    subSections: ISection[];
}
function getCodeBlocks(content: any): any {
    if (!Array.isArray(content)) return undefined;
    if (content[0] === 'inlinecode' &&
        content[1] &&
        (content[1].startsWith('TypeScript\n') || content[1].startsWith('JavaScript\n'))) return content[1];

    return content.map(getCodeBlocks)
        .filter(blocks => !!blocks && (!Array.isArray(blocks) || blocks.length));
}
function getSubs<T>(list: T[], index: number, nodes: INode[]) {
    return list
        .slice(nodes[index].index + 1, (index + 1 < nodes.length)
            ? nodes[index + 1].index
            : list.length);
}
function listToTree(sections: IRoot[]): ISection[] {
    return sections
        .filter(section => section.level === sections[0].level)
        .map(root => ({
            ...root,
            index: sections.indexOf(root),
        }))
        .map((root, index, roots) => ({
            ...root,
            subSections: listToTree(getSubs(sections, index, roots)),
        }));
}
function concatCodeBlocks(sections: ISection[]): string[] {
    return sections
        .map(section => section.codeBlocks
            .map(codeBlock =>
                section.subSections.length
                    ? concatCodeBlocks(section.subSections)
                        .map(concatedBlocks => clearCodeBlock(codeBlock) + concatedBlocks)
                    : [clearCodeBlock(codeBlock)])
            .reduce((prev, current) => [...prev, ...current], []))
        .reduce((prev, current) => [...prev, ...current], []);
}
function clearCodeBlock(codeBlock: string) {
    return codeBlock.slice('TypeScript\n'.length);
}
export default class MarkDownReader extends AbstractReader {
    private exts = ['.md'];
    registerHook = () => { /* this reader doesn't need a hook */ }; // TODO: probably hook registering should be optional?
    read = async (filePath: string, result: Promise<string | string[]>) => {
        const spec = await result;
        if (Array.isArray(spec)) throw new Error('MarkDown reader have to be first in readers chain.');

        const mdTree: any[][] = markdown.parse(spec);
        const sections = mdTree
            .filter(node => node[0] === 'header')
            .map<INode>(header => ({
                level: header[1].level,
                name: header[2],
                index: mdTree.indexOf(header),
            }))
            .map<IRoot>((header, index, headers) => ({
                ...header,
                codeBlocks: getSubs(mdTree, index, headers)
                    .map(getCodeBlocks)
                    .reduce<string[]>((prev, current) => [...prev, ...current], []),
            }));
        const sectionTree = listToTree(sections);

        return concatCodeBlocks(sectionTree);
    };
}
