import TypeScript, {Node, SourceFile} from 'typescript';
import InterfaceExtractor from 'Infrastructure/File/Parser/InterfaceExtractor';
import NodeEntity from 'Core/File/NodeEntity';
import {AliasEntity, ImportEntity} from 'Core/DescriptorEntity';

describe('InterfaceExtractor', function (): void {
    let parser: InterfaceExtractor;

    beforeEach(function () {
        parser = new InterfaceExtractor();
    });

    it('should ignore wrong nodes', function (): void {
        const result: NodeEntity = new NodeEntity('test');
        parser.parse(TypeScript.factory.createJSDocComment(), result, 'test', []);
        expect(result).toEqual(new NodeEntity('test'));
    });

    it('should parse the interface', function (): void {
        const testSource: string = `interface Test {
            someOtherUnknown: UnknownObject;
            defaultProp: DefaultName;
            subProp: SubName;
            typeProp: typeof TypeName;
        }`;
        const sourceFile: SourceFile = TypeScript.createSourceFile('Test', testSource, TypeScript.ScriptTarget.Latest);
        const defaultImport: ImportEntity = new ImportEntity('/path/file', new AliasEntity('DefaultName', '', true));
        const subImport: ImportEntity = new ImportEntity('/path/file', new AliasEntity('SubName', 'SubName', false));
        const typeImport: ImportEntity = new ImportEntity('/path/file', new AliasEntity('TypeName', 'TypeName', false));
        const extraImport: ImportEntity = new ImportEntity('/path/file', new AliasEntity('ExtraName', '', true));
        const imports: Array<ImportEntity> = [defaultImport, subImport, typeImport, extraImport];

        const result: NodeEntity = new NodeEntity('');
        let theNode: any;

        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            if (theNode != undefined) return;
            theNode = node;
            parser.parse(node, result, 'Test', imports);
        });

        expect(result.name).toBe('Test');
        expect(result.node).toBe(theNode);
        expect(result.imports).toEqual([defaultImport, subImport, typeImport]);
    });

    it('should extract array of type', function (): void {
        const testSource: string = `interface Test {
            arrayProp: Array<DefaultName>;
        }`;
        const sourceFile: SourceFile = TypeScript.createSourceFile('Test', testSource, TypeScript.ScriptTarget.Latest);
        const defaultImport: ImportEntity = new ImportEntity('/path/file', new AliasEntity('DefaultName', '', true));
        const imports: Array<ImportEntity> = [defaultImport];

        const result: NodeEntity = new NodeEntity('');
        let theNode: any;

        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            if (theNode != undefined) return;
            theNode = node;
            parser.parse(node, result, 'Test', imports);
        });

        expect(result.name).toBe('Test');
        expect(result.node).toBe(theNode);
        expect(result.imports).toEqual([defaultImport]);
    });
});
