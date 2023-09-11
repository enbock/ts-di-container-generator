import InterfaceParser from './InterfaceParser';
import TypeScript, {Node, SourceFile} from 'typescript';
import DescriptorEntity, {InterfaceEntity} from 'Core/DescriptorEntity';

describe('InterfaceParser', function (): void {
    let parser: InterfaceParser;

    beforeEach(function () {
        parser = new InterfaceParser();

    });

    it('should ignore wrong nodes', function (): void {
        const result: DescriptorEntity = new DescriptorEntity('test');
        parser.parse(TypeScript.factory.createJSDocComment(), result);
        expect(result).toEqual(new DescriptorEntity('test'));
    });

    it('should parse the interface', function (): void {
        const testSource: string = 'export interface TestInterface {}';
        const sourceFile: SourceFile = TypeScript.createSourceFile('test', testSource, TypeScript.ScriptTarget.Latest);

        const result: DescriptorEntity = new DescriptorEntity('test');
        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            parser.parse(node, result);
        });
        expect(result.provides).toEqual([new InterfaceEntity('TestInterface')]);
    });
});
