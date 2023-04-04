import ImportGenerator from './ImportGenerator';
import DescriptorEntity, {AliasEntity, ImportEntity} from '../DescriptorEntity';
import TypeScript, {
    EmitHint,
    ImportDeclaration,
    NodeArray,
    NodeFlags,
    Printer,
    SourceFile,
    Statement,
    SyntaxKind
} from 'typescript';
import path from 'path';
import Spy = jasmine.Spy;

describe('ImportGenerator', function (): void {
    let importGenerator: ImportGenerator,
        dirname: Spy<typeof path.dirname>
    ;
    const printer: Printer = TypeScript.createPrinter({newLine: TypeScript.NewLineKind.LineFeed});

    beforeEach(function (): void {
        dirname = jasmine.createSpy();

        importGenerator = new ImportGenerator(
            dirname
        );
    });

    function generateCode(result: Array<ImportDeclaration>): string {
        const statements: NodeArray<Statement> = TypeScript.factory.createNodeArray<Statement>(result);
        let node: SourceFile = TypeScript.factory.createSourceFile(
            statements,
            TypeScript.factory.createToken(SyntaxKind.EndOfFileToken),
            NodeFlags.None
        );
        return printer.printNode(EmitHint.SourceFile, node, node);
    }

    it('should generate import statements', async function (): Promise<void> {
        const descriptor: DescriptorEntity = new DescriptorEntity('');
        descriptor.imports = [
            new ImportEntity('base\\path\\domain\\test::file:', new AliasEntity('test::alias:'))
        ];

        dirname.and.returnValue('base\\path\\container');

        const result: Array<ImportDeclaration> = importGenerator.generate(
            [descriptor],
            'base\\path',
            'test::targetFile:'
        );
        const code: string = generateCode(result);

        expect(dirname).toHaveBeenCalledWith('test::targetFile:');
        expect(code).toContain('import test::alias: from \'../domain/test::file:\';');
    });
});