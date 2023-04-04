import GenerateRequestInterface from 'Core/Generator/Interactor/GenerateRequest';
import DescriptorEntity from 'Core/DescriptorEntity';
import FileName from 'Core/FileName';

export default class GenerateRequest implements GenerateRequestInterface {
    constructor(
        public basePath: string = '',
        public descriptors: DescriptorEntity[] = [],
        public targetFile: FileName = ''
    ) {
    }
}