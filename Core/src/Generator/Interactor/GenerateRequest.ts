import FileName from 'Core/File/FileName';
import ConfigEntity from 'Core/Configuration/ConfigEntity';

export default interface GenerateRequest {
    ignoreList: Array<FileName>;
    basePath: string;
    mainFile: FileName;
    config: ConfigEntity;
}