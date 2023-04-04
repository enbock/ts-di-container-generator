import Presenter from './Presenter';
import fs from 'fs';
import StringHelper from 'Core/StringHelper';
import TypeScript, {ClassElement} from 'typescript';
import GenerateResponse from './GenerateResponse';
import MockedObject from '../MockedObject';
import Spy = jasmine.Spy;

describe('Presenter', function (): void {
    let presenter: Presenter,
        writeFile: Spy<typeof fs.promises.writeFile>
    ;
    
    beforeEach(function (): void {
        writeFile = jasmine.createSpy();
        presenter = new Presenter(
            new StringHelper(),
            writeFile
        );
    });

    function createTestProperty(): Array<ClassElement> {
        return [
            TypeScript.factory.createPropertyDeclaration(
                undefined,
                'testProperty',
                undefined,
                undefined,
                undefined
            )
        ];
    }

    it('should generate TypeScript file', function (): void {
        const generateResponse: GenerateResponse = new GenerateResponse(createTestProperty() as MockedObject);
        presenter.present(generateResponse, 'test::targetFile:');

        expect(writeFile).toHaveBeenCalledWith(
            'test::targetFile:',
            `// @formatter:off
testProperty;
`,
            {flag: 'w'}
        );
    });
});