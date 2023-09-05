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
        interfaceNames: Array<string>
    ;

    beforeEach(function (): void {
        fileClient = mock<FileClient>();
        interfaceNames = ['test::name'];

        useCase = new ManualCodeUseCase(
            fileClient,
            interfaceNames
        );
    });

    it('should extract manual modifiable interfaces', function (): void {
        fileClient.extractInterface.and.returnValue('test::code' as MockedObject);

        const request: ExtractRequest = {basePath: 'test::basePath' as MockedObject};
        const response: ExtractResponse = {code: new ManualCodeEntity()};

        useCase.extractManualModifiableInterfaces(request, response);

        expect(fileClient.extractInterface).toHaveBeenCalledWith(
            'test::basePath',
            './DependencyInjection/Container',
            'test::name'
        );
        expect(response.code.manualCode['test::name']).toBe('test::code' as MockedObject);
    });
});