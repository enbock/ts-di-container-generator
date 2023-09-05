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

describe('Controller', function (): void {
    let controller: Controller,
        generatorInteractor: Spy<GeneratorInteractor>,
        presenter: Spy<Presenter>,
        configUseCase: Spy<LanguageConfigUseCase>,
        manualCodeUseCase: Spy<ManualCodeUseCase>
    ;

    beforeEach(function (): void {
        generatorInteractor = mock<GeneratorInteractor>();
        presenter = mock<Presenter>();
        configUseCase = mock<LanguageConfigUseCase>();
        manualCodeUseCase = mock<ManualCodeUseCase>();

        controller = new Controller(
            generatorInteractor,
            presenter,
            configUseCase,
            manualCodeUseCase
        );
    });

    it('should generate TypeScript file', async function (): Promise<void> {
        let generateResponse: GenerateResponse = new GenerateResponse();
        let manualCodeResponse: ManualCodeResponse = new ManualCodeResponse();
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
            }
        );
        manualCodeUseCase.extractManualModifiableInterfaces.and.callFake(
            function (request: ExtractRequest, response: ExtractResponse): void {
                manualCodeResponse = response;
                response.code = 'test::code' as MockedObject;
            }
        );

        await controller.generate(
            'test::basePath:',
            'test::mainFile:',
            'test::ignoreList:' as MockedObject
        );

        expect(configUseCase.getConfig).toHaveBeenCalled();
        expect(generatorInteractor.loadAndGenerate).toHaveBeenCalled();
        expect(manualCodeUseCase.extractManualModifiableInterfaces).toHaveBeenCalledWith(
            {basePath: 'test::basePath:'},
            manualCodeResponse
        );
        expect(manualCodeResponse.code).toBe('test::code' as MockedObject);
        expect(presenter.present).toHaveBeenCalledWith(generateResponse, 'test::basePath:', manualCodeResponse);
    });
});
