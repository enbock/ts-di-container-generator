import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import InterfaceNodeEntity from 'Core/File/InterfaceNodeEntity';

export class FileError extends Error {
}

export default interface FileClient {
    extract(basePath: string, file: FileName, config: ConfigEntity): throwErrorOrReturn<FileError, DescriptorEntity>;

    makeImportPathsAbsolute(descriptor: DescriptorEntity, config: ConfigEntity): void;

    extractInterface(basePath: string, containerFile: FileName, interfaceName: string): InterfaceNodeEntity;
}