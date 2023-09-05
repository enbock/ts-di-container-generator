import TypeScript, {Node, SourceFile} from 'typescript';
import NamedInterfaceParser from 'Infrastructure/File/Parser/NamedInterfaceParser';
import InterfaceNodeEntity from 'Core/File/InterfaceNodeEntity';

describe('NamedInterfaceParser', function (): void {
    let parser: NamedInterfaceParser;

    beforeEach(function () {
        parser = new NamedInterfaceParser();
    });

    it('should ignore wrong nodes', function (): void {
        const result: InterfaceNodeEntity = new InterfaceNodeEntity('test');
        parser.parse(TypeScript.factory.createJSDocComment(), result, 'test');
        expect(result).toEqual(new InterfaceNodeEntity('test'));
    });

    it('should parse the interface', function (): void {
        const testSource: string = 'interface Test {}';
        const sourceFile: SourceFile = TypeScript.createSourceFile('Test', testSource, TypeScript.ScriptTarget.Latest);

        const result: InterfaceNodeEntity = new InterfaceNodeEntity('');
        let theNode: any;
        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            if (theNode != undefined) return;
            theNode = node;
            parser.parse(node, result, 'Test');
        });
        expect(result.name).toBe('Test');
        expect(result.node).toBe(theNode);
    });
});
