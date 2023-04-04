import Presenter from './Presenter';
import fs from 'fs';
import StringHelper from 'Core/StringHelper';
import TypeScript, {ClassElement} from 'typescript';
import GenerateResponse from './GenerateResponse';
import MockedObject from 'Core/MockedObject';
import path from 'path';
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
            new StringHelper(),
            writeFile,
            resolve
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
        resolve.and.returnValue('test::targetFile:');

        const generateResponse: GenerateResponse = new GenerateResponse(createTestProperty() as MockedObject);
        presenter.present(generateResponse, 'test::basePath:');

        expect(resolve).toHaveBeenCalledWith('test::basePath:', './DependencyInjection/Container');
        expect(writeFile).toHaveBeenCalledWith(
            'test::targetFile:.ts',
            `// @formatter:off
testProperty;
`,
            {flag: 'w'}
        );
    });
});