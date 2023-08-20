import GenerateRequestInterface from 'Core/Generator/Interactor/GenerateRequest';
import FileName from 'Core/File/FileName';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import ConfigResponseInterface from 'Core/Configuration/LanguageConfigUseCase/ConfigResponse';

export default class ConfigResponseAndGenerateRequest implements GenerateRequestInterface, ConfigResponseInterface {
    constructor(
        public basePath: string,
        public mainFile: FileName,
        public ignoreList: Array<FileName>
    ) {
    }

    public config: ConfigEntity = new ConfigEntity();
}