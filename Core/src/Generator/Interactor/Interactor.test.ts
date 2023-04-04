import Interactor from './Interactor';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import ContainerClassGenerator from 'Core/Generator/Interactor/Task/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/Interactor/Task/ContainerObjectGenerator';
import ImportGenerator from 'Core/Generator/Interactor/Task/ImportGenerator';
import StringHelper from 'Core/StringHelper';
import GenerateResponse from 'Core/Generator/Interactor/GenerateResponse';
import MockedObject from 'Core/MockedObject';
import GenerateRequest from 'Core/Generator/Interactor/GenerateRequest';
import FileExtractor from 'Core/Generator/Interactor/Task/FileExtractor';

describe('Interactor', function (): void {
    let interactor: Interactor,
        statementGenerator: Spy<ContainerClassGenerator>,
        objectGenerator: Spy<ContainerObjectGenerator>,
        importGenerator: Spy<ImportGenerator>,
        fileExtractor: Spy<FileExtractor>
    ;

    beforeEach(function (): void {
        statementGenerator = createSpyFromClass(ContainerObjectGenerator);
        objectGenerator = createSpyFromClass(ContainerObjectGenerator);
        importGenerator = createSpyFromClass(ImportGenerator);
        fileExtractor = createSpyFromClass(FileExtractor);

        interactor = new Interactor(
            new StringHelper(),
            statementGenerator,
            objectGenerator,
            importGenerator,
            fileExtractor
        );
    });

    it('should generate the container structure', async function (): Promise<void> {
        objectGenerator.generate.and.returnValue(['test::objectMembers:']);
        importGenerator.generate.and.returnValue(['test::importStatements:']);
        statementGenerator.generate.and.returnValue(['test::objectStatements']);
        fileExtractor.extract.and.returnValue(['test::descriptor:' as MockedObject]);

        const response: GenerateResponse = {statements: []};
        const request: GenerateRequest = {
            mainFile: 'test::targetFile:',
            basePath: 'test::basePath:',
            ignoreList: 'test::ignoreList:' as MockedObject
        };
        interactor.loadAndGenerate(request, response);

        expect(fileExtractor.extract).toHaveBeenCalledWith(
            'test::basePath:',
            'test::targetFile:',
            'test::ignoreList:',
            []
        );
        expect(objectGenerator.generate).toHaveBeenCalledWith(['test::descriptor:']);
        expect(importGenerator.generate).toHaveBeenCalledWith(
            ['test::descriptor:'],
            'test::basePath:',
            'test::targetFile:'
        );
        expect(statementGenerator.generate).toHaveBeenCalledWith(['test::objectMembers:']);
        expect(response.statements).toEqual(['test::importStatements:', 'test::objectStatements'] as MockedObject);
    });
});