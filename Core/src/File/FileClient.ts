import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';
import ConfigEntity from 'Core/Configuration/ConfigEntity';

export class FileError extends Error {
}

export default interface FileClient {
    extract(basePath: string, file: FileName, config: ConfigEntity): DescriptorEntity;

    makeImportPathsAbsolute(descriptor: DescriptorEntity, config: ConfigEntity): void;
}