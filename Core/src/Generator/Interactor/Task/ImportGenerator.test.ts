import ImportGenerator from './ImportGenerator';
import DescriptorEntity, {AliasEntity, ImportEntity} from '../../../DescriptorEntity';
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
import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';

describe('ImportGenerator', function (): void {
    let importGenerator: ImportGenerator;
    const printer: Printer = TypeScript.createPrinter({newLine: TypeScript.NewLineKind.LineFeed});

    beforeEach(function (): void {
        importGenerator = new ImportGenerator(
            path.resolve,
            path.relative,
            path.normalize
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
            new ImportEntity('base\\path\\domain\\test::file:', new AliasEntity('test::alias:', '', true))
        ];

        const result: Array<ImportDeclaration> = importGenerator.generate(
            [descriptor],
            'base\\path',
            new ConfigEntity(),
            false
        );
        const code: string = generateCode(result);

        expect(code).toContain('import test::alias: from \'../domain/test::file:\';');
    });

    it('should generate import statements for aliased imports', async function (): Promise<void> {
        const descriptor: DescriptorEntity = new DescriptorEntity('');
        descriptor.imports = [
            new ImportEntity('root\\global\\path\\domain\\test::file:', new AliasEntity('test::alias:', '', false))
        ];

        const alias: PathAlias = new PathAlias();
        alias.targetPath = 'global/path/';
        alias.name = 'global/';
        const config: ConfigEntity = new ConfigEntity();
        config.pathAliases = [alias];
        config.basePath = 'root';
        const result: Array<ImportDeclaration> = importGenerator.generate(
            [descriptor],
            'base\\path',
            config,
            false
        );
        const code: string = generateCode(result);

        expect(code).toContain('import { test::alias: } from \'global/domain/test::file:\';');
    });
});