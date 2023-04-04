import GenerateResponse from './GenerateResponse';
import TypeScript, {EmitHint, NodeArray, NodeFlags, Printer, SourceFile, Statement, SyntaxKind} from 'typescript';
import FileName from 'Core/FileName';
import StringHelper from 'Core/StringHelper';
import fs from 'fs';

export default class Presenter {
    private printer: Printer = TypeScript.createPrinter({newLine: TypeScript.NewLineKind.LineFeed});

    constructor(
        private stringHelper: StringHelper,
        private writeFile: typeof fs.promises.writeFile
    ) {
    }

    public async present(generateResponse: GenerateResponse, targetFile: FileName): Promise<void> {
        const statements: NodeArray<Statement> = TypeScript.factory.createNodeArray(generateResponse.statements);
        let node: SourceFile = TypeScript.factory.createSourceFile(
            statements,
            TypeScript.factory.createToken(SyntaxKind.EndOfFileToken),
            NodeFlags.None
        );
        const code: string = '// @formatter:off\n' + this.printer.printNode(EmitHint.SourceFile, node, node);
        await this.writeFile(targetFile, code, {flag: 'w'});
    }
}