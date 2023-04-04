import ContainerClassGenerator from './ContainerClassGenerator';
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

describe('ContainerClassGenerator', function () {
    let containerClassGenerator: ContainerClassGenerator;
    const printer: Printer = TypeScript.createPrinter({newLine: TypeScript.NewLineKind.LineFeed});

    beforeEach(function () {
        containerClassGenerator = new ContainerClassGenerator();
    });

    function convertToCode(result: NodeArray<Statement>): string {
        let node: SourceFile = TypeScript.factory.createSourceFile(
            result,
            TypeScript.factory.createToken(SyntaxKind.EndOfFileToken),
            NodeFlags.None
        );
        return printer.printNode(EmitHint.SourceFile, node, node);
    }

    function createTestProperty(): ClassElement {
        return TypeScript.factory.createPropertyDeclaration(
            [
                TypeScript.factory.createModifier(SyntaxKind.PublicKeyword)
            ],
            'testProperty',
            undefined,
            TypeScript.factory.createTypeReferenceNode('string'),
            TypeScript.factory.createNewExpression(
                TypeScript.factory.createIdentifier('TestClass'),
                [],
                []
            )
        );
    }

    it('should generate container class', function (): void {
        const result: NodeArray<Statement> = containerClassGenerator.generate([createTestProperty()]);
        const code: string = convertToCode(result);
        expect(code).toBe(`class Container {
    public testProperty: string = new TestClass();
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
`);
    });
});
