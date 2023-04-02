import ContainerObjectGenerator from './ContainerObjectGenerator';
import StringHelper from '../StringHelper';
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
import DescriptorEntity, {AliasName, InterfaceEntity, RequirementEntity, Type} from '../DescriptorEntity';

describe('ContainerObjectGenerator', function () {
    let generator: ContainerObjectGenerator;
    const printer: Printer = TypeScript.createPrinter({newLine: TypeScript.NewLineKind.LineFeed});

    beforeEach(function () {
        generator = new ContainerObjectGenerator(new StringHelper());
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
        const objectRequirement: RequirementEntity = new RequirementEntity('injectedClass', 'OtherClass');
        const nativeTypeRequirement: RequirementEntity = new RequirementEntity('nativeValue');
        descriptor.requires = new Map<AliasName, RequirementEntity[]>(
            [
                [
                    'ClassToCreate',
                    [objectRequirement, nativeTypeRequirement]
                ]
            ]
        );
        const providingClass: InterfaceEntity = new InterfaceEntity('ClassToCreate');
        providingClass.type = Type.CLASS;
        descriptor.provides = [providingClass];

        const result: ClassElement[] = generator.generate([descriptor]);

        const code: string = generateCode(result);
        let expectedCode: string = 'public classToCreate: ClassToCreate = ' +
            'new ClassToCreate(this.otherClass, this.manualInjections.classToCreateNativeValueValue);';
        expect(code).toContain(expectedCode);
    });
});