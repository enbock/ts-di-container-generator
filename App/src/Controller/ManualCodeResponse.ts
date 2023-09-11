import ExtractResponse from 'Core/ManualCodeUseCase/ExtractResponse';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';
import AdditionalCreationRequest from 'Core/Generator/AdditionalCreationUseCase/Request';
import NodeEntity from 'Core/File/NodeEntity';

export default class ManualCodeResponse implements ExtractResponse, AdditionalCreationRequest {
    public ['constructor']: ManualCodeEntity = new ManualCodeEntity();
    public interfaces: ManualCodeEntity = new ManualCodeEntity();
    public properties: ManualCodeEntity = new ManualCodeEntity();

    public get manualImport(): NodeEntity {
        return this.interfaces.manualCode['AdditionalResources'];
    }
}