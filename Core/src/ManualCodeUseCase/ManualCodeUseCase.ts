import FileClient from 'Core/File/FileClient';
import ExtractResponse from 'Core/ManualCodeUseCase/ExtractResponse';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';
import ExtractRequest from 'Core/ManualCodeUseCase/ExtractRequest';

export default class ManualCodeUseCase {
    constructor(
        private fileClient: FileClient,
        private interfaceNames: Array<string>
    ) {
    }

    public extractManualModifiableInterfaces(request: ExtractRequest, response: ExtractResponse): void {
        const data: ManualCodeEntity = new ManualCodeEntity();
        this.interfaceNames.forEach(x => this.extractCode(request.basePath, x, data));

        response.code = data;
    }

    private extractCode(basePath: string, interfaceName: string, data: ManualCodeEntity): void {
        data.manualCode[interfaceName] = this.fileClient.extractInterface(
            basePath,
            './DependencyInjection/Container',
            interfaceName
        );
    }
}