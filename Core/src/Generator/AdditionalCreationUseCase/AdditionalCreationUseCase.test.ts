import AdditionalCreationUseCase from './AdditionalCreationUseCase';
import MockedObject from 'Core/MockedObject';
import Response from 'Core/Generator/AdditionalCreationUseCase/Response';
import Request from 'Core/Generator/AdditionalCreationUseCase/Request';
import NodeEntity from 'Core/File/NodeEntity';
import DescriptorEntity from 'Core/DescriptorEntity';

describe('AdditionalCreationUseCase', function (): void {
    let useCase: AdditionalCreationUseCase;

    beforeEach(function (): void {
        useCase = new AdditionalCreationUseCase();
    });

    it('should convert request to descriptor', function (): void {
        const manualImport: NodeEntity = new NodeEntity('');
        manualImport.imports = ['test::importItem1' as MockedObject];
        const request: Request = {manualImport: manualImport};
        const response: Response = {additionalDescriptors: []};

        useCase.convertToDescriptor(request, response);

        const descriptor: DescriptorEntity = response.additionalDescriptors[0];
        expect(descriptor.imports[0]).toBe('test::importItem1' as MockedObject);
    });
});