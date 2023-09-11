import ClassConstructorExtractor from './ClassConstructorExtractor';
import ts from 'typescript';
import TypeScript, {EmitHint, NodeFlags, SourceFile, Statement, SyntaxKind} from 'typescript';
import NodeEntity from 'Core/File/NodeEntity';

describe('ClassConstructorExtractors', function (): void {
    let extractor: ClassConstructorExtractor;

    beforeEach(function (): void {
        extractor = new ClassConstructorExtractor();
    });

    it('should parse constructor', async function (): Promise<void> {
        const sourceText: string = `
            class ClassName {
                constructor() {
                    ViewInjection(Start, this.startAdapter);
                }
            }
        `;
        const sourceFile: SourceFile = ts.createSourceFile('file', sourceText, 99);
        const result: NodeEntity = new NodeEntity('');
        ts.forEachChild(sourceFile, n => extractor.parse(n, result, 'ClassName'));

        expect(ts.isConstructorDeclaration(result.node)).toBeTrue();
        let node: SourceFile = TypeScript.factory.createSourceFile(
            [result.node as Statement],
            TypeScript.factory.createToken(SyntaxKind.EndOfFileToken),
            NodeFlags.None
        );
        const printer: ts.Printer = TypeScript.createPrinter({newLine: TypeScript.NewLineKind.LineFeed});
        const code: string = printer.printNode(EmitHint.SourceFile, node, node);
        expect(code).toBe('constructor() {\n' +
            '    ViewInjection(Start, this.startAdapter);\n' +
            '}\n');
    });
});