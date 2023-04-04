import Interactor from './Interactor';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import ContainerClassGenerator from 'Core/Generator/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/ContainerObjectGenerator';
import ImportGenerator from 'Core/Generator/ImportGenerator';
import StringHelper from 'Core/StringHelper';
import GenerateResponse from 'Core/Generator/Interactor/GenerateResponse';
import MockedObject from 'Core/MockedObject';
import GenerateRequest from 'Core/Generator/Interactor/GenerateRequest';

describe('Interactor', function (): void {
    let interactor: Interactor,
        statementGenerator: Spy<ContainerClassGenerator>,
        objectGenerator: Spy<ContainerObjectGenerator>,
        importGenerator: Spy<ImportGenerator>
    ;

    beforeEach(function (): void {
        statementGenerator = createSpyFromClass(ContainerObjectGenerator);
        objectGenerator = createSpyFromClass(ContainerObjectGenerator);
        importGenerator = createSpyFromClass(ImportGenerator);

        interactor = new Interactor(
            new StringHelper(),
            statementGenerator,
            objectGenerator,
            importGenerator
        );
    });

    it('should generate the container structure', async function (): Promise<void> {
        objectGenerator.generate.and.returnValue(['test::objectMembers:']);
        importGenerator.generate.and.returnValue(['test::importStatements:']);
        statementGenerator.generate.and.returnValue(['test::objectStatements']);

        const response: GenerateResponse = {statements: []};
        const request: GenerateRequest = {
            targetFile: 'test::targetFile:',
            basePath: 'test::basePath:',
            descriptors: 'test::descriptors:' as MockedObject
        };
        interactor.generate(request, response);

        expect(objectGenerator.generate).toHaveBeenCalledWith('test::descriptors:');
        expect(importGenerator.generate).toHaveBeenCalledWith(
            'test::descriptors:',
            'test::basePath:',
            'test::targetFile:'
        );
        expect(statementGenerator.generate).toHaveBeenCalledWith(['test::objectMembers:']);
        expect(response.statements).toEqual(['test::importStatements:', 'test::objectStatements'] as MockedObject);
    });
});