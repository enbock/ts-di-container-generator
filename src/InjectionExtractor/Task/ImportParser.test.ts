import ImportParser from './ImportParser';
import TypeScript, {Node, SourceFile} from 'typescript';
import DescriptorEntity, {AliasEntity, ImportEntity} from '../../DescriptorEntity';

describe('ImportParser', function (): void {
    let parser: ImportParser;

    beforeEach(function () {
        parser = new ImportParser();
    });

    it('should ignore wrong nodes', function (): void {
        const result: DescriptorEntity = new DescriptorEntity('test');
        parser.parse(TypeScript.factory.createJSDocComment(), result);
        expect(result).toEqual(new DescriptorEntity('test'));
    });

    it('should parse a default import', function (): void {
        const testSource: string = `import DefaultImport from './somethingsDefaultImported`;
        const sourceFile: SourceFile = TypeScript.createSourceFile('test', testSource, TypeScript.ScriptTarget.Latest);

        const result: DescriptorEntity = new DescriptorEntity('test');
        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            parser.parse(node, result);
        });
        const expectedImport: ImportEntity = new ImportEntity(
            './somethingsDefaultImported',
            new AliasEntity('DefaultImport')
        );
        expect(result.imports).toEqual([expectedImport]);
    });

    it('should parse a non default import', function (): void {
        const testSource: string = `import {SubImport} from './test::importedFile:`;
        const sourceFile: SourceFile = TypeScript.createSourceFile('test', testSource, TypeScript.ScriptTarget.Latest);

        const result: DescriptorEntity = new DescriptorEntity('test');
        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            parser.parse(node, result);
        });
        const expectedImport: ImportEntity = new ImportEntity(
            './test::importedFile:',
            new AliasEntity('SubImport')
        );
        expect(result.imports).toEqual([expectedImport]);
    });

    it('should parse a aliased non default import', function (): void {
        const testSource: string = `import {SubImport as AliasName} from './test::importedFile:`;
        const sourceFile: SourceFile = TypeScript.createSourceFile('test', testSource, TypeScript.ScriptTarget.Latest);

        const result: DescriptorEntity = new DescriptorEntity('test');
        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            parser.parse(node, result);
        });
        const expectedImport: ImportEntity = new ImportEntity(
            './test::importedFile:',
            new AliasEntity('AliasName', 'SubImport')
        );
        expect(result.imports).toEqual([expectedImport]);
    });
});
