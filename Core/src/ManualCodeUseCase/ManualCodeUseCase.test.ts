import ManualCodeUseCase from './ManualCodeUseCase';
import {Spy} from 'jasmine-auto-spies';
import mock from 'Core/mock';
import FileClient from 'Core/File/FileClient';
import MockedObject from 'Core/MockedObject';
import ExtractRequest from 'Core/ManualCodeUseCase/ExtractRequest';
import ExtractResponse from 'Core/ManualCodeUseCase/ExtractResponse';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';

describe('ManualCodeUseCase', function (): void {
    let useCase: ManualCodeUseCase,
        fileClient: Spy<FileClient>,
        interfaceNames: Array<string>,
        propertyNames: { [property: string]: string }
    ;

    beforeEach(function (): void {
        fileClient = mock<FileClient>();
        interfaceNames = ['test::interface'];
        propertyNames = {'test::property': 'test::type'};

        useCase = new ManualCodeUseCase(
            fileClient,
            interfaceNames,
            propertyNames
        );
    });

    it('should extract manual modifiable interfaces', function (): void {
        fileClient.extractInterface.and.returnValue('test::interfaceCode' as MockedObject);
        fileClient.extractContainerConstructor.and.returnValue('test::constructorCode' as MockedObject);

        const request: ExtractRequest = {basePath: 'test::basePath' as MockedObject};
        const response: ExtractResponse = {
            interfaces: new ManualCodeEntity(),
            properties: new ManualCodeEntity(),
            constructor: new ManualCodeEntity()
        };

        useCase.extractManualModifiableInterfaces(request, response);

        expect(fileClient.extractInterface).toHaveBeenCalledWith(
            'test::basePath',
            './DependencyInjection/Container',
            'test::interface'
        );
        expect(fileClient.extractContainerProperty).toHaveBeenCalledWith(
            'test::basePath',
            './DependencyInjection/Container',
            'test::property',
            'test::type',
            new ManualCodeEntity()
        );
        expect(fileClient.extractContainerConstructor).toHaveBeenCalledWith(
            'test::basePath',
            './DependencyInjection/Container'
        );
        expect(response.interfaces.manualCode['test::interface']).toBe('test::interfaceCode' as MockedObject);
        expect(response.constructor.manualCode['constructor']).toBe('test::constructorCode' as MockedObject);
    });
});