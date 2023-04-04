import DescriptorEntity from 'Core/DescriptorEntity';
import GeneratorInteractor from 'Core/Generator/Interactor/Interactor';
import GenerateRequest from './GenerateRequest';
import GenerateResponse from './GenerateResponse';
import Presenter from './Presenter';

export default class Controller {

    constructor(
        private generatorInteractor: GeneratorInteractor,
        private presenter: Presenter
    ) {
    }

    public async generate(descriptors: DescriptorEntity[], basePath: string, targetFile: string): Promise<void> {
        const generateResponse: GenerateResponse = new GenerateResponse();
        this.generatorInteractor.generate(
            new GenerateRequest(
                basePath,
                descriptors,
                targetFile
            ),
            generateResponse
        );
        await this.presenter.present(generateResponse, targetFile);
    }
}