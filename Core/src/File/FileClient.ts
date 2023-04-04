import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';

export class FileError extends Error {
}

export default interface FileClient {
    extract(basePath: string, file: FileName): DescriptorEntity;

    makeImportPathsAbsolute(descriptor: DescriptorEntity): void;
}