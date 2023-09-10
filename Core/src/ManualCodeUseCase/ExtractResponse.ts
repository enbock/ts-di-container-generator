import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';

export default interface ExtractResponse {
    properties: ManualCodeEntity;
    constructor: ManualCodeEntity;
    interfaces: ManualCodeEntity;
}