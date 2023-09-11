import FileName from 'Core/File/FileName';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import DescriptorEntity, {ImportEntity} from 'Core/DescriptorEntity';
import {ClassElement} from 'typescript';

export default interface GenerateRequest {
    additionalDescriptors: Array<DescriptorEntity>;
    ignoreList: Array<FileName>;
    basePath: string;
    mainFile: FileName;
    config: ConfigEntity;
    additionalImports: Array<ImportEntity>;
    additionalContainerMembers: ClassElement[];
}