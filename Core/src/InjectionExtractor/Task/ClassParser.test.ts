import ClassParser from './ClassParser';
import TypeScript, {Node, SourceFile} from 'typescript';
import DescriptorEntity, {AliasName, ClassEntity, RequirementEntity} from 'Core/DescriptorEntity';

describe('ClassParser', function (): void {
    let parser: ClassParser;

    beforeEach(function () {
        parser = new ClassParser();
    });

    it('should ignore wrong nodes', function (): void {
        const result: DescriptorEntity = new DescriptorEntity('test');
        parser.parse(TypeScript.factory.createJSDocComment(), result);
        expect(result).toEqual(new DescriptorEntity('test'));
    });

    it('should parse a class', function (): void {
        const testSource: string = `class TestClass {}`;
        const sourceFile: SourceFile = TypeScript.createSourceFile('test', testSource, TypeScript.ScriptTarget.Latest);

        const result: DescriptorEntity = new DescriptorEntity('test');
        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            parser.parse(node, result);
        });
        expect(result.provides).toEqual([new ClassEntity('TestClass')]);
    });

    it('should parse the requirements', function (): void {
        const testSource: string = `
            class TestClass {
                constructor(
                    private otherObject: OtherClass,
                    private nativeValue: string
                ) {}
            }
        `;
        const sourceFile: SourceFile = TypeScript.createSourceFile('test', testSource, TypeScript.ScriptTarget.Latest);

        const result: DescriptorEntity = new DescriptorEntity('test');
        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            parser.parse(node, result);
        });
        expect(result.provides).toEqual([new ClassEntity('TestClass')]);
        const otherObjectRequirement: RequirementEntity = new RequirementEntity('otherObject', false, 'OtherClass');
        const nativeValueRequirement: RequirementEntity = new RequirementEntity('nativeValue');
        const expectedRequirements: Map<AliasName, RequirementEntity[]> = new Map<AliasName, RequirementEntity[]>(
            [
                [
                    'TestClass',
                    [
                        otherObjectRequirement,
                        nativeValueRequirement
                    ]
                ]
            ]
        );
        expect(result.requires).toEqual(expectedRequirements);
    });
});
