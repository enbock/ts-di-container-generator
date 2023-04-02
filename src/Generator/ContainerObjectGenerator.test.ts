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
        expect(code).toContain(
            'private _classToCreate?: ClassToCreate;'
        );
        expect(code).toContain(
            'public get classToCreate(): ClassToCreate { ' +
            'if (this._classToCreate)' +
            '\n        return this._classToCreate;' +
            '\n    else' +
            '\n        return this._classToCreate = new ClassToCreate(this.otherClass, this.manualInjections.classToCreateNativeValue);'
        );
    });
});