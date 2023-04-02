import TypeScript, {
    ClassElement,
    EmitHint,
    NodeArray,
    NodeFlags,
    Printer,
    SourceFile,
    Statement,
    SyntaxKind
} from 'typescript';
import fs from 'fs';
import StringHelper from '../StringHelper';
import DescriptorEntity from '../DescriptorEntity';
import ContainerObjectGenerator from './ContainerObjectGenerator';
import ContainerClassGenerator from './ContainerClassGenerator';

export default class FileCreator {
    private printer: Printer = TypeScript.createPrinter({newLine: TypeScript.NewLineKind.LineFeed});

    constructor(
        private stringHelper: StringHelper,
        private statementGenerator: ContainerClassGenerator,
        private objectGenerator: ContainerObjectGenerator,
        private writeFile: typeof fs.promises.writeFile
    ) {
    }

    public async generate(descriptors: DescriptorEntity[], basePath: string, targetFile: string): Promise<void> {
        const members: ClassElement[] = this.objectGenerator.generate(descriptors);
        const statements: NodeArray<Statement> = this.statementGenerator.generate(members);
        let node: SourceFile = TypeScript.factory.createSourceFile(
            statements,
            TypeScript.factory.createToken(SyntaxKind.EndOfFileToken),
            NodeFlags.None
        );
        const code: string = '// @formatter:off\n' + this.printer.printNode(EmitHint.SourceFile, node, node);
        await this.writeFile(targetFile, code, {flag: 'w'});
    }
}