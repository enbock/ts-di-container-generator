import GeneratorInteractor from 'Core/Generator/Interactor/Interactor';
import ConfigResponseAndGenerateRequest from './ConfigResponseAndGenerateRequest';
import GenerateResponse from './GenerateResponse';
import Presenter from './Presenter';
import FileName from 'Core/File/FileName';
import LanguageConfigUseCase from 'Core/Configuration/LanguageConfigUseCase/LanguageConfigUseCase';
import ManualCodeUseCase from 'Core/ManualCodeUseCase/ManualCodeUseCase';
import ManualCodeResponse from 'App/Controller/ManualCodeResponse';

export default class Controller {

    constructor(
        private generatorInteractor: GeneratorInteractor,
        private presenter: Presenter,
        private configUseCase: LanguageConfigUseCase,
        private manualCodeUseCase: ManualCodeUseCase
    ) {
    }

    public async generate(basePath: string, mainFile: string, ignoreList: Array<FileName>): Promise<void> {
        const configResponseAndGenerateRequest: ConfigResponseAndGenerateRequest = new ConfigResponseAndGenerateRequest(
            basePath,
            mainFile,
            ignoreList
        );
        const generateResponse: GenerateResponse = new GenerateResponse();

        await this.configUseCase.getConfig(configResponseAndGenerateRequest);
        this.generatorInteractor.loadAndGenerate(configResponseAndGenerateRequest, generateResponse);

        const manualCodeResponse: ManualCodeResponse = new ManualCodeResponse();
        this.manualCodeUseCase.extractManualModifiableInterfaces({basePath: basePath}, manualCodeResponse);

        await this.presenter.present(generateResponse, basePath, manualCodeResponse);
    }
}