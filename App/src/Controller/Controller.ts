import GeneratorInteractor from 'Core/Generator/Interactor/Interactor';
import GenerateRequest from './GenerateRequest';
import GenerateResponse from './GenerateResponse';
import Presenter from './Presenter';
import FileName from 'Core/File/FileName';

export default class Controller {

    constructor(
        private generatorInteractor: GeneratorInteractor,
        private presenter: Presenter
    ) {
    }

    public async generate(basePath: string, mainFile: string, ignoreList: Array<FileName>): Promise<void> {
        const generateRequest: GenerateRequest = new GenerateRequest(basePath, mainFile, ignoreList);
        const generateResponse: GenerateResponse = new GenerateResponse();

        this.generatorInteractor.loadAndGenerate(generateRequest, generateResponse);
        await this.presenter.present(generateResponse, basePath);
    }
}