import RootDependencyParser from './RootDependencyParser';
import TypeScript, {Node, SourceFile} from 'typescript';
import DescriptorEntity, {RequirementEntity} from 'Core/DescriptorEntity';

describe('RootDependencyParser', function (): void {
    let rootDependencyParser: RootDependencyParser;

    beforeEach(function (): void {
        rootDependencyParser = new RootDependencyParser();
    });

    it('should parse the root dependency marker', function (): void {
        const testSource: string = 'const root: ThisDependency = new ThisDependency()';
        const sourceFile: SourceFile = TypeScript.createSourceFile('test', testSource, TypeScript.ScriptTarget.Latest);

        const result: DescriptorEntity = new DescriptorEntity('test');
        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            rootDependencyParser.parse(node, result);
        });

        const expectedRequirement: Map<string, Array<RequirementEntity>> = new Map();
        expectedRequirement.set('', [new RequirementEntity('', 'ThisDependency', false)]);
        expect(result.requires.keys()).toEqual(expectedRequirement.keys());
        expect(result.requires.values()).toEqual(expectedRequirement.values());
    });
});