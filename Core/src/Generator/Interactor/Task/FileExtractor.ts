import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';
import FileClient, {FileError} from 'Core/File/FileClient';
import CatchHelper from 'Core/CatchHelper';
import FailedDescriptorEntity from 'Core/Generator/Interactor/FailedDescriptorEntity';
import SanitizerService from 'Core/Generator/Sanitizer/SanitizerService';

export default class FileExtractor {
    constructor(
        private fileClient: FileClient,
        private sanitizerService: SanitizerService
    ) {
    }

    public extract(
        basePath: string,
        file: FileName,
        ignoreList: Array<FileName>,
        failedDescriptors: Array<FailedDescriptorEntity>,
        descriptors: Array<DescriptorEntity> = []
    ): Array<DescriptorEntity> {
        try {
            const descriptor: DescriptorEntity = this.fileClient.extract(basePath, file);
            this.sanitizerService.sanitizeDescriptor(
                descriptor,
                ignoreList,
                basePath
            );

            descriptors.unshift(descriptor);
            for (const i of descriptor.imports) {
                const foundImport: DescriptorEntity | undefined = descriptors.find(
                    (d: DescriptorEntity): boolean => d.file == i.file
                );
                if (foundImport) continue;
                this.extract(descriptor.basePath, i.file, ignoreList, failedDescriptors, descriptors);
            }
        } catch (error) {
            CatchHelper.assert(error, FileError);
            failedDescriptors.push(new FailedDescriptorEntity(basePath, file));
        }

        return descriptors;
    }
}