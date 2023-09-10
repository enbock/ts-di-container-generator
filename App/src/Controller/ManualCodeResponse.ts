import ExtractResponse from 'Core/ManualCodeUseCase/ExtractResponse';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';

export default class ManualCodeResponse implements ExtractResponse {
    public ['constructor']: ManualCodeEntity = new ManualCodeEntity();
    public interfaces: ManualCodeEntity = new ManualCodeEntity();
    public properties: ManualCodeEntity = new ManualCodeEntity();
}