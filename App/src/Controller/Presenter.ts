import GenerateResponse from './GenerateResponse';
import TypeScript, {EmitHint, NodeArray, NodeFlags, Printer, SourceFile, Statement, SyntaxKind} from 'typescript';
import FileName from 'Core/File/FileName';
import fs from 'fs';
import path from 'path';
import ManualCodeResponse from 'App/Controller/ManualCodeResponse';
import NodeEntity from 'Core/File/NodeEntity';

export default class Presenter {
    private printer: Printer = TypeScript.createPrinter({newLine: TypeScript.NewLineKind.LineFeed});

    constructor(
        private writeFile: typeof fs.promises.writeFile,
        private resolve: typeof path.resolve
    ) {
    }

    public async present(
        generateResponse: GenerateResponse,
        basePath: string,
        manualCodeResponse: ManualCodeResponse
    ): Promise<void> {
        const containerPath: string = this.resolve(basePath, './DependencyInjection/Container');
        const targetFile: FileName = containerPath + '.ts';

        const statements: NodeArray<Statement> = TypeScript.factory.createNodeArray(
            [
                ...generateResponse.imports,
                ...Object.values<NodeEntity>(manualCodeResponse.interfaces.manualCode).map(x => x.node as Statement),
                ...generateResponse.statements
            ]
        );
        let node: SourceFile = TypeScript.factory.createSourceFile(
            statements,
            TypeScript.factory.createToken(SyntaxKind.EndOfFileToken),
            NodeFlags.None
        );
        const code: string = '// @formatter:off\n'+
            '// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols\n\n' +
            this.printer.printNode(EmitHint.SourceFile, node, node);
        await this.writeFile(targetFile, code, {flag: 'w'});
    }
}