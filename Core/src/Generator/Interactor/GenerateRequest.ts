import FileName from 'Core/File/FileName';

export default interface GenerateRequest {
    ignoreList: Array<FileName>;
    basePath: string;
    mainFile: FileName;
}