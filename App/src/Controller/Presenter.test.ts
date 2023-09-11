import Presenter from './Presenter';
import fs from 'fs';
import TypeScript, {ClassElement, InterfaceDeclaration} from 'typescript';
import GenerateResponse from './GenerateResponse';
import MockedObject from 'Core/MockedObject';
import path from 'path';
import ManualCodeResponse from 'App/Controller/ManualCodeResponse';
import NodeEntity from 'Core/File/NodeEntity';
import Spy = jasmine.Spy;

describe('Presenter', function (): void {
    let presenter: Presenter,
        writeFile: Spy<typeof fs.promises.writeFile>,
        resolve: Spy<typeof path.resolve>
    ;

    beforeEach(function (): void {
        writeFile = jasmine.createSpy();
        resolve = jasmine.createSpy();
        presenter = new Presenter(
            writeFile,
            resolve
        );
    });

    function createTestProperty(name: string): Array<ClassElement> {
        return [
            TypeScript.factory.createPropertyDeclaration(
                undefined,
                'testProperty_' + name,
                undefined,
                undefined,
                undefined
            )
        ];
    }

    function createTestInterface(): InterfaceDeclaration {
        return TypeScript.factory.createInterfaceDeclaration(
            undefined,
            'TestInterface',
            undefined,
            undefined,
            []
        );
    }

    it('should generate TypeScript file', function (): void {
        resolve.and.returnValue('test::targetFile:');

        const generateResponse: GenerateResponse = new GenerateResponse();
        generateResponse.imports = createTestProperty('imports') as MockedObject;
        generateResponse.statements = createTestProperty('statements') as MockedObject;
        const manualCodeResponse: ManualCodeResponse = new ManualCodeResponse();
        const interfaceData: NodeEntity = new NodeEntity('TestInterface');
        interfaceData.node = createTestInterface();
        manualCodeResponse.interfaces.manualCode['test::interface'] = interfaceData;
        presenter.present(generateResponse, 'test::basePath:', manualCodeResponse);

        expect(resolve).toHaveBeenCalledWith('test::basePath:', './DependencyInjection/Container');
        expect(writeFile).toHaveBeenCalledWith(
            'test::targetFile:.ts',
            `// @formatter:off
// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

testProperty_imports;
interface TestInterface {
}
testProperty_statements;
`,
            {flag: 'w'}
        );
    });
});