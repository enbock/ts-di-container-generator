import Request from 'Core/Generator/AdditionalCreationUseCase/Request';
import Response from 'Core/Generator/AdditionalCreationUseCase/Response';
import DescriptorEntity from 'Core/DescriptorEntity';

export default class AdditionalCreationUseCase {
    public convertToDescriptor(request: Request, response: Response): void {
        const descriptor: DescriptorEntity = new DescriptorEntity('AdditionResources');
        request.manualImport.imports.forEach(x => descriptor.imports.push(x));
        response.additionalDescriptors = [descriptor];
    }
}