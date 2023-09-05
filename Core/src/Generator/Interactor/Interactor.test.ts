import Interactor from './Interactor';
import {Spy} from 'jasmine-auto-spies';
import ContainerClassGenerator from 'Core/Generator/Interactor/Task/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/Interactor/Task/ContainerObjectGenerator';
import ImportGenerator from 'Core/Generator/Interactor/Task/ImportGenerator';
import GenerateResponse from 'Core/Generator/Interactor/GenerateResponse';
import MockedObject from 'Core/MockedObject';
import GenerateRequest from 'Core/Generator/Interactor/GenerateRequest';
import FileExtractor, {ParameterBag} from 'Core/Generator/Interactor/Task/FileExtractor';
import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';
import mock from 'Core/mock';
import InterfacePropertyGenerator from 'Core/Generator/Interactor/Task/InterfacePropertyGenerator';

describe('Interactor', function (): void {
    let interactor: Interactor,
        statementGenerator: Spy<ContainerClassGenerator>,
        objectGenerator: Spy<ContainerObjectGenerator>,
        importGenerator: Spy<ImportGenerator>,
        fileExtractor: Spy<FileExtractor>,
        interfacePropertyGenerator: Spy<InterfacePropertyGenerator>
    ;

    beforeEach(function (): void {
        statementGenerator = mock<ContainerClassGenerator>();
        objectGenerator = mock<ContainerObjectGenerator>();
        importGenerator = mock<ImportGenerator>();
        fileExtractor = mock<FileExtractor>();
        interfacePropertyGenerator = mock<InterfacePropertyGenerator>();

        interactor = new Interactor(
            statementGenerator,
            objectGenerator,
            importGenerator,
            fileExtractor,
            interfacePropertyGenerator
        );
    });

    it('should generate the container structure', async function (): Promise<void> {
        const descriptor: DescriptorEntity = new DescriptorEntity('test::descriptor:');

        objectGenerator.generate.and.returnValue(['test::objectMembers:']);
        interfacePropertyGenerator.generate.and.returnValue(['test::interfaceProperties:']);
        importGenerator.generate.and.returnValue(['test::importStatements:']);
        importGenerator.generateImportList.and.returnValue(['test::additionalImports']);
        statementGenerator.generate.and.returnValue(['test::objectStatements']);
        fileExtractor.extract.and.callFake(
            function (
                file: FileName,
                parameters: ParameterBag
            ): void {
                parameters.failedDescriptors.push('test::failedDescriptor:' as MockedObject);
                parameters.descriptors.push(descriptor as MockedObject);
            }
        );

        const response: GenerateResponse = {statements: [], imports: []};
        const request: GenerateRequest = {
            config: 'test::config' as MockedObject,
            mainFile: 'test::targetFile:',
            basePath: 'test::basePath:',
            ignoreList: 'test::ignoreList:' as MockedObject,
            additionalImports: 'test::extraImports' as MockedObject
        };
        interactor.loadAndGenerate(request, response);

        expect(fileExtractor.extract).toHaveBeenCalledWith(
            'test::targetFile:',
            new ParameterBag(
                'test::basePath:',
                'test::ignoreList:' as MockedObject,
                ['test::failedDescriptor:' as MockedObject],
                [descriptor],
                'test::config' as MockedObject
            )
        );
        expect(objectGenerator.generate).toHaveBeenCalledWith([descriptor]);
        expect(importGenerator.generate).toHaveBeenCalledWith(
            [descriptor],
            'test::basePath:',
            'test::config',
            false
        );
        expect(importGenerator.generateImportList).toHaveBeenCalledWith(
            [descriptor],
            'test::extraImports' as MockedObject,
            'test::basePath:',
            'test::config',
            true
        );
        expect(statementGenerator.generate).toHaveBeenCalledWith([
            'test::interfaceProperties:',
            'test::objectMembers:'
        ]);
        expect(response.imports).toEqual(['test::importStatements:', 'test::additionalImports'] as MockedObject);
        expect(response.statements).toEqual(['test::objectStatements'] as MockedObject);
    });
});