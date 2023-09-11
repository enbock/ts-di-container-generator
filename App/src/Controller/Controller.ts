import GeneratorInteractor from 'Core/Generator/Interactor/Interactor';
import ConfigResponseAndGenerateRequest from './ConfigResponseAndGenerateRequest';
import GenerateResponse from './GenerateResponse';
import Presenter from './Presenter';
import FileName from 'Core/File/FileName';
import LanguageConfigUseCase from 'Core/Configuration/LanguageConfigUseCase/LanguageConfigUseCase';
import ManualCodeUseCase from 'Core/ManualCodeUseCase/ManualCodeUseCase';
import ManualCodeResponse from 'App/Controller/ManualCodeResponse';
import {ClassElement} from 'typescript';
import AdditionalCreationUseCase from 'Core/Generator/AdditionalCreationUseCase/AdditionalCreationUseCase';

export default class Controller {

    constructor(
        private generatorInteractor: GeneratorInteractor,
        private presenter: Presenter,
        private configUseCase: LanguageConfigUseCase,
        private manualCodeUseCase: ManualCodeUseCase,
        private additionalCreationUseCase: AdditionalCreationUseCase
    ) {
    }

    public async generate(basePath: string, mainFile: string, ignoreList: Array<FileName>): Promise<void> {
        const manualCodeResponse: ManualCodeResponse = new ManualCodeResponse();
        this.manualCodeUseCase.extractManualModifiableInterfaces({basePath: basePath}, manualCodeResponse);

        const configResponseAndGenerateRequest: ConfigResponseAndGenerateRequest = new ConfigResponseAndGenerateRequest(
            basePath,
            mainFile,
            ignoreList,
            Object.values(manualCodeResponse.interfaces.manualCode).map(x => x.imports).flat(),
            [
                ...Object.values(manualCodeResponse.properties.manualCode).map(x => x.node as ClassElement),
                ...Object.values(manualCodeResponse.constructor.manualCode).map(x => x.node as ClassElement)
            ]
        );
        const generateResponse: GenerateResponse = new GenerateResponse();

        this.additionalCreationUseCase.convertToDescriptor(manualCodeResponse, configResponseAndGenerateRequest);
        await this.configUseCase.getConfig(configResponseAndGenerateRequest);
        this.generatorInteractor.loadAndGenerate(configResponseAndGenerateRequest, generateResponse);

        await this.presenter.present(generateResponse, basePath, manualCodeResponse);
    }
}