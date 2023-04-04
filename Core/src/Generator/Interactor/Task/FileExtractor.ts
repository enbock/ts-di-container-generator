import FileName from 'Core/File/FileName';
import DescriptorEntity, {ImportEntity} from 'Core/DescriptorEntity';
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
        descriptors: Array<DescriptorEntity>
    ): void {
        try {
            const descriptor: DescriptorEntity = this.fileClient.extract(basePath, file);
            this.sanitizerService.sanitizeDescriptor(
                descriptor,
                ignoreList,
                basePath
            );

            const length: number = [...descriptor.requires.values()].length;
            if (length == 0) {
                for (const d of descriptors) {
                    d.imports = d.imports.filter((i: ImportEntity): boolean => i.file != descriptor.file);
                    for (const requirements of d.requires.values())
                        for (const r of requirements)
                            r.import = r.import.file != descriptor.file ? r.import : new ImportEntity();
                }
                return;
            }

            descriptors.unshift(descriptor);
            for (const i of descriptor.imports) {
                const foundImport: DescriptorEntity | undefined = descriptors.find(
                    (d: DescriptorEntity): boolean => d.file == i.file
                );
                if (foundImport) continue;
                this.extract(basePath, i.file, ignoreList, failedDescriptors, descriptors);
            }
        } catch (error) {
            CatchHelper.assert(error, FileError);
            failedDescriptors.push(new FailedDescriptorEntity(basePath, file));
        }
    }
}