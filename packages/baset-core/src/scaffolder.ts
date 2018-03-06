import path from 'path';
import tsc from 'typescript';
import { isExists, writeFile } from './utils';

export interface IDeclaration {
    name: string | tsc.__String;
    originalName?: string;
    type: string;
}
export interface IFnSignature {
    parameters: Declaration[];
    returnType: string;
}
export interface IClassDeclaration extends IDeclaration {
    constructors: IFnSignature[];
    methods: IFnSignature[];
}
export interface IFnDeclaration extends IDeclaration {
    calls: IFnSignature[];
}
export type Declaration = IDeclaration | IFnDeclaration | IClassDeclaration;

export class Scaffolder {
    scaffold(files: string[]) {
        return files
            .map(this.scaffoldSpec)
            .map(async decl => {
                const ext = path.extname(decl.name);
                const specName = decl.name.replace(new RegExp(`${ext}$`), `.spec${ext}`);
                if (!await isExists(specName)) {
                    await writeFile(specName, this.generateSpec(decl.output), { encoding: 'utf8' });
                }

                return specName;
            });
    }

    private generateSpec(declarations: Declaration[]): string {
    }

    private generateImports(declarations: Declaration[]): string {
    }

    private generateClassUsage(declarations: IFnDeclaration): string {
    }

    private generateFnUsage(declarations: IClassDeclaration): string {
    }

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
            const symbolName = symbol.getEscapedName();
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
                    methods: node.members
                        .map(member => member.name && checker.getSymbolAtLocation(member.name))
                        .filter(isDefined)
                        .map(serializeSymbol)
                        .filter(isFnDeclaration),
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
