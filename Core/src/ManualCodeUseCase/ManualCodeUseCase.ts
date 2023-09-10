import FileClient from 'Core/File/FileClient';
import ExtractResponse from 'Core/ManualCodeUseCase/ExtractResponse';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';
import ExtractRequest from 'Core/ManualCodeUseCase/ExtractRequest';
import FileName from 'Core/File/FileName';

export default class ManualCodeUseCase {
    private readonly containerFile: FileName = './DependencyInjection/Container';

    constructor(
        private fileClient: FileClient,
        private interfaceNames: Array<string>,
        private propertyNames: { [property: string]: string }
    ) {
    }

    public extractManualModifiableInterfaces(request: ExtractRequest, response: ExtractResponse): void {
        const interfaces: ManualCodeEntity = new ManualCodeEntity();
        this.interfaceNames.forEach(x => this.extractInterfaceCode(request.basePath, x, interfaces));

        const containerConstructor: ManualCodeEntity = new ManualCodeEntity();
        this.extractConstructor(request.basePath, containerConstructor);

        const properties: ManualCodeEntity = new ManualCodeEntity();
        Object.keys(this.propertyNames).forEach(x => this.extractPropertyCode(
            request.basePath,
            x,
            this.propertyNames[x],
            properties
        ));

        response.interfaces = interfaces;
        response.properties = properties;
        response.constructor = containerConstructor;
    }

    private extractInterfaceCode(
        basePath: string,
        interfaceName: string,
        data: ManualCodeEntity
    ): void {
        data.manualCode[interfaceName] = this.fileClient.extractInterface(
            basePath,
            this.containerFile,
            interfaceName
        );
    }

    private extractConstructor = (basePath: string, containerConstructor: ManualCodeEntity): void => {
        containerConstructor.manualCode['constructor'] = this.fileClient.extractContainerConstructor(
            basePath,
            this.containerFile
        );
    };

    private extractPropertyCode(
        basePath: string,
        propertyName: string,
        typeName: string,
        data: ManualCodeEntity
    ): void {
        this.fileClient.extractContainerProperty(
            basePath,
            this.containerFile,
            propertyName,
            typeName,
            data
        );
    }
}