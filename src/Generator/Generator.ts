import StringHelper from '../StringHelper';
import DescriptorEntity from '../DescriptorEntity';
import path from 'path';
import FileCreator from './FileCreator';
import FileName from '../FileName';
import InjectionExtractor from '../InjectionExtractor/InjectionExtractor';
import Sanitizer from './Sanitizer/Sanitizer';

export default class Generator {
    private descriptors: Array<DescriptorEntity> = [];

    constructor(
        private stringHelper: StringHelper,
        private extractor: InjectionExtractor,
        private fileCreator: FileCreator,
        private pathSanitizer: Sanitizer
    ) {
    }

    async generate(basePath: string, mainFile: FileName, ignoreList: Array<FileName>): Promise<void> {
        this.descriptors = [];

        this.extract(basePath, mainFile, ignoreList);

        const containerPath: string = path.resolve(basePath, './DependencyInjection/Container');

        await this.fileCreator.generate(
            this.descriptors,
            basePath,
            containerPath + '.ts'
        );
    }

    private extract(basePath: string, mainFile: FileName, ignoreList: Array<FileName>): void {
        const descriptor: DescriptorEntity = this.extractor.extract(basePath, mainFile);
        this.pathSanitizer.sanitizeDescriptor(descriptor, ignoreList);
        console.log('>>>> ' + descriptor);
    }
}