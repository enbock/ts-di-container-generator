import StringHelper from '../../../StringHelper';
import TypeScript, {
    ClassDeclaration,
    ClassElement,
    EmitHint,
    NodeArray,
    NodeFlags,
    Printer,
    SourceFile,
    Statement,
    SyntaxKind
} from 'typescript';
import DescriptorEntity, {InterfaceEntity} from '../../../DescriptorEntity';
import InterfacePropertyGenerator from 'Core/Generator/Interactor/Task/InterfacePropertyGenerator';

describe('InterfacePropertyGenerator', function () {
    let generator: InterfacePropertyGenerator;
    const printer: Printer = TypeScript.createPrinter({newLine: TypeScript.NewLineKind.LineFeed});

    beforeEach(function () {
        generator = new InterfacePropertyGenerator(new StringHelper());
    });

    function generateCode(result: ClassElement[]): string {
        const container: ClassDeclaration = TypeScript.factory.createClassDeclaration(
            undefined,
            'OutputClass',
            undefined,
            undefined,
            result
        );
        const statements: NodeArray<Statement> = TypeScript.factory.createNodeArray<Statement>([container]);
        let node: SourceFile = TypeScript.factory.createSourceFile(
            statements,
            TypeScript.factory.createToken(SyntaxKind.EndOfFileToken),
            NodeFlags.None
        );
        return printer.printNode(EmitHint.SourceFile, node, node);
    }

    it('should generates an property for a class', async function (): Promise<void> {
        const descriptor: DescriptorEntity = new DescriptorEntity('test::file:');
        const interfaceElement: InterfaceEntity = new InterfaceEntity('InterfaceToCreate');
        descriptor.provides = [interfaceElement];

        const result: ClassElement[] = generator.generate([descriptor]);

        const code: string = generateCode(result);
        expect(code).toContain(
            'public interfaceToCreate: InterfaceToCreate = this.interfaceInstances.interfaceToCreate;'
        );
    });
});