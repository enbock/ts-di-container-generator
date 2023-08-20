import FileName from 'Core/File/FileName';
import DescriptorEntity, {ImportEntity} from 'Core/DescriptorEntity';
import FileClient, {FileError} from 'Core/File/FileClient';
import CatchHelper from 'Core/CatchHelper';
import FailedDescriptorEntity from 'Core/Generator/Interactor/FailedDescriptorEntity';
import SanitizerService from 'Core/Generator/Sanitizer/SanitizerService';
import ConfigEntity from 'Core/Configuration/ConfigEntity';

export class ParameterBag {
    constructor(
        public basePath: string,
        public ignoreList: Array<FileName>,
        public failedDescriptors: Array<FailedDescriptorEntity>,
        public descriptors: Array<DescriptorEntity>,
        public config: ConfigEntity
    ) {
    }
}

export default class FileExtractor {
    constructor(
        private fileClient: FileClient,
        private sanitizerService: SanitizerService
    ) {
    }

    public extract(
        file: FileName,
        parameters: ParameterBag
    ): void {
        try {
            const descriptor: DescriptorEntity = this.fileClient.extract(parameters.basePath, file, parameters.config);
            this.sanitizerService.sanitizeDescriptor(
                descriptor,
                parameters.ignoreList,
                parameters.basePath,
                parameters.config
            );

            const amountRequirements: number = [...descriptor.requires.values()].length;
            if (amountRequirements == 0) {
                this.removeFileFromRequirementsAndImports(parameters.descriptors, descriptor);
                return;
            }

            parameters.descriptors.unshift(descriptor);
            for (const i of descriptor.imports) {
                const alreadyImported: DescriptorEntity | undefined = parameters.descriptors.find(
                    (d: DescriptorEntity): boolean => d.file == i.file
                );
                if (alreadyImported) continue;
                this.extract(i.file, parameters);
            }
        } catch (error) {
            CatchHelper.assert(error, FileError);
            parameters.failedDescriptors.push(new FailedDescriptorEntity(parameters.basePath, file));
        }
    }

    private removeFileFromRequirementsAndImports(
        descriptors: Array<DescriptorEntity>,
        descriptor: DescriptorEntity
    ): void {
        for (const d of descriptors) {
            d.imports = d.imports.filter((i: ImportEntity): boolean => i.file != descriptor.file);
            for (const requirements of d.requires.values())
                for (const r of requirements)
                    r.import = r.import.file == descriptor.file ? new ImportEntity() : r.import;
        }
    }
}