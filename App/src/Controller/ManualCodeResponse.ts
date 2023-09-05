import ExtractResponse from 'Core/ManualCodeUseCase/ExtractResponse';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';

export default class ManualCodeResponse implements ExtractResponse {
    public code: ManualCodeEntity = new ManualCodeEntity();
}