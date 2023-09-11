import DescriptorEntity, {AliasEntity, ClassEntity, ImportEntity} from 'Core/DescriptorEntity';
import FileExtractor, {ParameterBag} from 'Core/Generator/Interactor/Task/FileExtractor';

export default class AdditionalResourcesExtractor {
    constructor(
        private fileExtractor: FileExtractor
    ) {
    }

    public extract(
        additionalDescriptors: Array<DescriptorEntity>,
        extractorParameters: ParameterBag,
        importHolderDescriptor: DescriptorEntity
    ): void {
        additionalDescriptors.forEach(
            x => x.imports.forEach(
                i => this.extractImport(i, extractorParameters, importHolderDescriptor)
            )
        );
    }

    private extractImport(
        i: ImportEntity,
        extractorParameters: ParameterBag,
        importHolderDescriptor: DescriptorEntity
    ): void {
        const extractedDescriptor: DescriptorEntity = this.fileExtractor.extract(i.file, extractorParameters);
        const alias: string = extractedDescriptor.provides.find(
            p => (<ClassEntity>p).isDefault == i.alias.isDefault
        )?.name || '';
        importHolderDescriptor.imports.push(new ImportEntity(
            extractedDescriptor.file,
            new AliasEntity(alias, '', i.alias.isDefault)
        ));
    }
}