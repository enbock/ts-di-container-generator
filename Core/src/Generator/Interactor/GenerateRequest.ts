import DescriptorEntity from 'Core/DescriptorEntity';
import FileName from 'Core/FileName';

export default interface GenerateRequest {
    descriptors: DescriptorEntity[];
    basePath: string;
    targetFile: FileName;
}