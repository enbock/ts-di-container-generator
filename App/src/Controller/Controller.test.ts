import Controller from './Controller';
import {Spy} from 'jasmine-auto-spies';
import MockedObject from 'Core/MockedObject';
import GeneratorInteractor from 'Core/Generator/Interactor/Interactor';
import Presenter from './Presenter';
import GenerateResponse from './GenerateResponse';
import LanguageConfigUseCase from 'Core/Configuration/LanguageConfigUseCase/LanguageConfigUseCase';
import mock from 'Core/mock';
import ConfigResponse from 'Core/Configuration/LanguageConfigUseCase/ConfigResponse';
import GenerateRequest from 'Core/Generator/Interactor/GenerateRequest';
import ManualCodeUseCase from 'Core/ManualCodeUseCase/ManualCodeUseCase';
import ManualCodeResponse from 'App/Controller/ManualCodeResponse';
import ExtractRequest from 'Core/ManualCodeUseCase/ExtractRequest';
import ExtractResponse from 'Core/ManualCodeUseCase/ExtractResponse';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';
import NodeEntity from 'Core/File/NodeEntity';
import AdditionalCreationUseCase from 'Core/Generator/AdditionalCreationUseCase/AdditionalCreationUseCase';
import Request from 'Core/Generator/AdditionalCreationUseCase/Request';
import Response from 'Core/Generator/AdditionalCreationUseCase/Response';

describe('Controller', function (): void {
    let controller: Controller,
        generatorInteractor: Spy<GeneratorInteractor>,
        presenter: Spy<Presenter>,
        configUseCase: Spy<LanguageConfigUseCase>,
        manualCodeUseCase: Spy<ManualCodeUseCase>,
        additionalCreationUseCase: Spy<AdditionalCreationUseCase>
    ;

    beforeEach(function (): void {
        generatorInteractor = mock<GeneratorInteractor>();
        presenter = mock<Presenter>();
        configUseCase = mock<LanguageConfigUseCase>();
        manualCodeUseCase = mock<ManualCodeUseCase>();
        additionalCreationUseCase = mock<AdditionalCreationUseCase>();

        controller = new Controller(
            generatorInteractor,
            presenter,
            configUseCase,
            manualCodeUseCase,
            additionalCreationUseCase
        );
    });

    it('should generate TypeScript file', async function (): Promise<void> {
        let generateResponse: GenerateResponse = new GenerateResponse();
        let manualCodeResponse: ManualCodeResponse = new ManualCodeResponse();

        const interfaceCode: ManualCodeEntity = new ManualCodeEntity();
        const interfaceNode: NodeEntity = new NodeEntity('test::code');
        interfaceNode.imports = ['test::import' as MockedObject];
        interfaceCode.manualCode['test::code'] = interfaceNode;

        const constructorCode: ManualCodeEntity = new ManualCodeEntity();
        const constructorNode: NodeEntity = new NodeEntity('test::code');
        constructorNode.node = 'test::constructorNode' as MockedObject;
        constructorCode.manualCode['test::code'] = constructorNode;

        const propertyCode: ManualCodeEntity = new ManualCodeEntity();
        const propertyNode: NodeEntity = new NodeEntity('test::code');
        propertyNode.node = 'test::propertyNode' as MockedObject;
        propertyCode.manualCode['test::code'] = propertyNode;

        configUseCase.getConfig.and.callFake(async function (response: ConfigResponse): Promise<void> {
            response.config = 'test::config' as MockedObject;
        });
        generatorInteractor.loadAndGenerate.and.callFake(
            function (request: GenerateRequest, response: GenerateResponse): void {
                generateResponse = response;
                generateResponse.statements = 'test::statements:' as MockedObject;
                expect(request.basePath).toBe('test::basePath:');
                expect(request.mainFile).toBe('test::mainFile:');
                expect(request.ignoreList).toBe('test::ignoreList:');
                expect(request.config).toBe('test::config' as MockedObject);
                expect(request.additionalImports).toEqual(['test::import' as MockedObject]);
                expect(request.additionalDescriptors).toBe('test::additionalDescriptors' as MockedObject);
            }
        );
        manualCodeUseCase.extractManualModifiableInterfaces.and.callFake(
            function (request: ExtractRequest, response: ExtractResponse): void {
                manualCodeResponse = <ManualCodeResponse>response;
                response.interfaces = interfaceCode;
                response.constructor = constructorCode;
                response.properties = propertyCode;
            }
        );
        additionalCreationUseCase.convertToDescriptor.and.callFake(
            function convertToDescriptor(request: Request, response: Response): void {
                expect(request).toBe(manualCodeResponse);
                response.additionalDescriptors = 'test::additionalDescriptors' as MockedObject;
            }
        );

        await controller.generate(
            'test::basePath:',
            'test::mainFile:',
            'test::ignoreList:' as MockedObject
        );

        expect(configUseCase.getConfig).toHaveBeenCalled();
        expect(additionalCreationUseCase.convertToDescriptor).toHaveBeenCalled();
        expect(generatorInteractor.loadAndGenerate).toHaveBeenCalled();
        expect(manualCodeUseCase.extractManualModifiableInterfaces).toHaveBeenCalledWith(
            {basePath: 'test::basePath:'},
            manualCodeResponse
        );
        expect(manualCodeResponse.interfaces).toBe(interfaceCode);
        expect(presenter.present).toHaveBeenCalledWith(generateResponse, 'test::basePath:', manualCodeResponse);
    });
});
