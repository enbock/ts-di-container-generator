import GenerateRequestInterface from 'Core/Generator/Interactor/GenerateRequest';
import FileName from 'Core/File/FileName';

export default class GenerateRequest implements GenerateRequestInterface {
    constructor(
        public basePath: string = '',
        public mainFile: FileName = '',
        public ignoreList: Array<FileName>
    ) {
    }

}