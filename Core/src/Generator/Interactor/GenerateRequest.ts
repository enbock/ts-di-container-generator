import FileName from 'Core/File/FileName';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import {ImportEntity} from 'Core/DescriptorEntity';
import {ClassElement} from 'typescript';

export default interface GenerateRequest {
    ignoreList: Array<FileName>;
    basePath: string;
    mainFile: FileName;
    config: ConfigEntity;
    additionalImports: Array<ImportEntity>;
    additionalContainerMembers: ClassElement[];
}