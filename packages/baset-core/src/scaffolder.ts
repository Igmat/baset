import { Chance } from 'chance';
import path from 'path';
import tsc from 'typescript';
import { isExists, writeFile } from './utils';

export interface IDeclaration {
    name: string;
    originalName?: string;
    type: string;
}
interface IDefaultDeclaration extends IDeclaration {
    originalName: string;
}
export interface IFnSignature {
    parameters: Declaration[];
    returnType: string;
}
export interface IClassDeclaration extends IDeclaration {
    constructors: IFnSignature[];
    methods: IFnDeclaration[];
}
export interface IFnDeclaration extends IDeclaration {
    calls: IFnSignature[];
}
export type Declaration = IDeclaration | IFnDeclaration | IClassDeclaration;

const blankLine = '\n';
const specTemplate = (imports: string, classUsages: string, fnUsages: string) =>
    `${imports}${classUsages}${fnUsages}`;

export class Scaffolder {
    chance: Chance.Chance;
    constructor() {
        this.chance = new Chance();
    }

    scaffold(files: string[]) {
        return files
            .map(this.scaffoldSpec)
            .map(async decl => {
                const ext = path.extname(decl.name);
                const specName = decl.name.replace(new RegExp(`${ext}$`), `.spec${ext}`);
                const relativePath = `./${path.relative(path.dirname(specName), decl.name)}`
                    .replace(new RegExp(`${ext}$`), '')
                    .replace(path.sep, '/');
                if (await isExists(specName) || decl.output.length === 0) return;

                await writeFile(specName, this.generateSpec(decl.output, relativePath), { encoding: 'utf8' });

                return specName;
            });
    }

    private generateSpec = (declarations: Declaration[], name: string): string =>
        specTemplate(
            this.generateImports(declarations, name),
            declarations
                .filter(isClassDeclaration)
                .map(this.generateClassUsage)
                .join(blankLine),
            declarations
                .filter(isFnDeclaration)
                .map(this.generateFnUsage)
                .join(blankLine),
        )

    private generateImports = (declarations: Declaration[], name: string): string => {
        const defaults = declarations
            .filter(isDefault)
            .map(declaration => declaration.originalName);
        const defaultsImport = defaults.length > 0
            ? `${defaults.join(', ')}, `
            : '';
        const others = declarations
            .filter(isNotDefault)
            .map(declaration => declaration.name);
        const othersImport = others.length > 0
            ? `{ ${others.join(', ')} }`
            : '';
        const from = (defaults.length > 0 || others.length > 0)
            ? ' from '
            : '';

        return `import ${defaultsImport}${othersImport}${from}'${name}';${blankLine}`;
    }

    private generateClassUsage = (declaration: IClassDeclaration): string => {
        const className = declaration.originalName || declaration.name;
        const instanceNamePrefix = `${className.slice(0, 1).toLowerCase()}${className.slice(1)}`;
        const instances = declaration.constructors
            .map((constructor, index) => {
                const constructorIndex = (declaration.constructors.length > 1 && instanceNamePrefix !== className)
                    ? index.toString()
                    : '';
                const instanceName = `${instanceNamePrefix}${constructorIndex}`;
                const instanceString =
                    `export const ${instanceName} = new ${className}(${this.generateArgs(constructor.parameters)});`;
                const methods = declaration.methods
                    .map(method => method.calls
                        .map((call, callIndex) => {
                            const callName = method.calls.length > 1
                                ? `${method.name}Value${constructorIndex}_${callIndex}`
                                : `${method.name}Value${constructorIndex}`;
                            const callString = `${instanceName}.${method.name}(${this.generateArgs(call.parameters)})`;

                            return `export const ${callName} = ${callString};`;
                        })
                        .join(blankLine))
                    .join(blankLine);

                return `${blankLine}${instanceString}${blankLine}${methods}`;
            })
            .join(blankLine);

        return `${instances}${blankLine}`;
    }

    private generateFnUsage = (declaration: IFnDeclaration): string => {
        const fnName = declaration.originalName || declaration.name;
        const calls = declaration.calls
            .map((call, index) => {
                const indexSuffix = declaration.calls.length > 1
                    ? index.toString()
                    : '';

                return `export const ${fnName}Value${indexSuffix} = ${fnName}(${this.generateArgs(call.parameters)});`;
            })
            .join(blankLine);

        return `${calls}${blankLine}`;
    }

    private generateArgs = (parameters: Declaration[]): string =>
        parameters
            .map(parameter => {
                switch (parameter.type) {
                    case 'number':
                        return this.chance.integer({ min: -1000, max: 1000 });
                    case 'string':
                        return `'${this.chance.string({ length: this.chance.integer({ min: 0, max: 10 }) })}'`;
                    default:
                        return 'undefined';
                }
            })
            .join(', ');

    private scaffoldSpec = (name: string) => {
        const program = tsc.createProgram([name], {});
        const checker = program.getTypeChecker();
        const output: Declaration[] = [];

        for (const sourceFile of program.getSourceFiles()) {
            if (sourceFile.isDeclarationFile) continue;
            const symbol = checker.getSymbolAtLocation(sourceFile);
            if (!symbol) continue;
            output.push(
                ...checker.getExportsOfModule(symbol)
                    .map(serializeSymbol)
                    .filter(isDefined));
        }

        return {
            name,
            output,
        };

        /** Serialize a symbol into a json object */
        function serializeSymbol(symbol: tsc.Symbol): Declaration | undefined {
            if (!symbol.valueDeclaration) return;
            const node = symbol.valueDeclaration;
            const symbolName = symbol.getName();
            const type = checker.getTypeOfSymbolAtLocation(symbol, node);
            const common: IDeclaration = {
                name: symbolName,
                type: checker.typeToString(type),
            };
            if (isNodeExported(node) &&
                common.name === 'default' &&
                (tsc.isClassDeclaration(node) || tsc.isFunctionDeclaration(node)) &&
                node.name) {
                common.originalName = node.name.getText();
            }
            if (tsc.isClassDeclaration(node)) {
                return {
                    ...common,
                    constructors: type.getConstructSignatures().map(serializeSignature),
                    methods: distinctBy(
                        node.members
                            .map(member => member.name && checker.getSymbolAtLocation(member.name))
                            .filter(isDefined)
                            .map(serializeSymbol)
                            .filter(isFnDeclaration),
                        method => method.name),
                };
            }
            if (tsc.isFunctionDeclaration(node) ||
                tsc.isMethodDeclaration(node)) {
                return {
                    ...common,
                    calls: type.getCallSignatures().map(serializeSignature),
                };
            }

            return common;
        }

        /** Serialize a signature (call or construct) */
        function serializeSignature(signature: tsc.Signature): IFnSignature {
            return {
                parameters: signature.parameters
                    .map(serializeSymbol)
                    .filter(isDefined),
                returnType: checker.typeToString(signature.getReturnType()),
            };
        }
    }
}

/** True if this is visible outside this file, false otherwise */
function isNodeExported(node: tsc.Node): boolean {
    return (
        // tslint:disable-next-line:no-bitwise
        tsc.getCombinedModifierFlags(node) & tsc.ModifierFlags.Export) !== 0 ||
        (!!node.parent && node.parent.kind === tsc.SyntaxKind.SourceFile);
}

function isDefined<T>(declaration?: T): declaration is T {
    return !!declaration;
}

function isFnDeclaration(declaration?: Declaration): declaration is IFnDeclaration {
    return !!(declaration && (declaration as IFnDeclaration).calls);
}

function isClassDeclaration(declaration?: Declaration): declaration is IClassDeclaration {
    return !!(declaration && (declaration as IClassDeclaration).constructors);
}
function isDefault(declaration: Declaration): declaration is IDefaultDeclaration {
    return !!declaration.originalName;
}
function isNotDefault(declaration: Declaration) {
    return !declaration.originalName;
}
function distinctBy<T, U>(array: T[], keySelector: (value: T) => U) {
    return array
        .map(keySelector)
        .filter((key, index, keys) => keys.indexOf(key) === index)
        .map(uniqueKey => array.find(entity => keySelector(entity) === uniqueKey))
        .filter(isDefined);
}
