import PropertyExtractor from 'Infrastructure/File/Parser/PropertyExtractor';
import ts, {Identifier, PropertyDeclaration, SourceFile} from 'typescript';
import NodeEntity from 'Core/File/NodeEntity';
import MockedObject from 'Core/MockedObject';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';

describe('PropertyExtractor', function (): void {
    let extractor: PropertyExtractor;

    beforeEach(function (): void {
        extractor = new PropertyExtractor();
    });

    it('should parse property', async function (): Promise<void> {
        const sourceText: string = `
            class ClassName {
                private other:string='';
                private requestedProperty: any = {}
                private requestedPropertyExtra: any = {}
            }
        `;
        const typeName: string = 'TypeName';
        const sourceFile: SourceFile = ts.createSourceFile('file', sourceText, 99);
        const data: ManualCodeEntity = new ManualCodeEntity();
        ts.forEachChild(sourceFile, n => extractor.parse(n, 'requestedProperty', typeName, 'ClassName', data));

        const actualProperty: NodeEntity = data.manualCode['requestedProperty'];
        expect(ts.isPropertyDeclaration(actualProperty.node)).toBeTrue();
        expect(actualProperty.name).toBe('requestedProperty');
        expect(((actualProperty.node as PropertyDeclaration).name as Identifier).escapedText)
            .toEqual('requestedProperty' as MockedObject);
        const extraProperty: NodeEntity = data.manualCode['requestedPropertyExtra'];
        expect(ts.isPropertyDeclaration(extraProperty.node)).toBeTrue();
        expect(data.manualCode['other']).toBeUndefined();
    });

    it('should create default code if missing', async function (): Promise<void> {
        const sourceText: string = `
            class ClassName {
            }
        `;
        const typeName: string = 'TypeName';
        const sourceFile: SourceFile = ts.createSourceFile('file', sourceText, 99);
        const data: ManualCodeEntity = new ManualCodeEntity();
        ts.forEachChild(sourceFile, n => extractor.parse(n, 'requestedProperty', typeName, 'ClassName', data));

        const actualProperty: NodeEntity = data.manualCode['requestedProperty'];
        expect(ts.isPropertyDeclaration(actualProperty.node)).toBeTrue();
        expect(actualProperty.name).toBe('requestedProperty');
        expect(((actualProperty.node as PropertyDeclaration).name as Identifier).escapedText)
            .toEqual('requestedProperty' as MockedObject);
    });
});