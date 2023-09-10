import GenerateRequestInterface from 'Core/Generator/Interactor/GenerateRequest';
import FileName from 'Core/File/FileName';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import ConfigResponseInterface from 'Core/Configuration/LanguageConfigUseCase/ConfigResponse';
import {ImportEntity} from 'Core/DescriptorEntity';
import ts from 'typescript';

export default class ConfigResponseAndGenerateRequest implements GenerateRequestInterface, ConfigResponseInterface {
    constructor(
        public basePath: string,
        public mainFile: FileName,
        public ignoreList: Array<FileName>,
        public additionalImports: Array<ImportEntity>,
        public additionalContainerMembers: ts.ClassElement[]
    ) {
    }

    public config: ConfigEntity = new ConfigEntity();
}