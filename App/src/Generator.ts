import StringHelper from 'Core/StringHelper';
import DescriptorEntity from 'Core/DescriptorEntity';
import path from 'path';
import Controller from './Controller/Controller';
import FileName from 'Core/FileName';
import InjectionExtractor from './InjectionExtractor/InjectionExtractor';
import Sanitizer from 'Core/Generator/Sanitizer/Sanitizer';

export default class Generator {
    private descriptors: Array<DescriptorEntity> = [];

    constructor(
        private stringHelper: StringHelper,
        private extractor: InjectionExtractor,
        private fileCreator: Controller,
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

    private extract(basePath: string, file: FileName, ignoreList: Array<FileName>): void {

        const descriptor: DescriptorEntity = this.extractor.extract(basePath, file);
        this.pathSanitizer.sanitizeDescriptor(descriptor, ignoreList, basePath);

        console.log(descriptor.toString(), '\n');

        this.descriptors.unshift(descriptor);
        for (const i of descriptor.imports) {
            const foundImport: DescriptorEntity | undefined = this.descriptors.find(
                (d: DescriptorEntity): boolean => d.file == i.file
            );
            if (foundImport) continue;
            this.extract(basePath, i.file, ignoreList);
        }
    }
}
