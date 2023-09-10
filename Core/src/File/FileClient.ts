import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import NodeEntity from 'Core/File/NodeEntity';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';

export class FileError extends Error {
}

export default interface FileClient {
    extract(basePath: string, file: FileName, config: ConfigEntity): throwErrorOrReturn<FileError, DescriptorEntity>;

    makeImportPathsAbsolute(descriptor: DescriptorEntity, config: ConfigEntity): void;

    extractInterface(basePath: string, containerFile: FileName, interfaceName: string): NodeEntity;

    extractContainerConstructor(basePath: string, containerFile: FileName): NodeEntity;

    extractContainerProperty(
        basePath: string,
        containerFile: FileName,
        propertyName: string,
        typeName: string,
        data: ManualCodeEntity
    ): void;
}