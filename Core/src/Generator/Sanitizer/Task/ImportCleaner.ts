import DescriptorEntity from '../../../DescriptorEntity';

export default class ImportCleaner {
    public replaceImportsByRequirements(descriptor: DescriptorEntity): void {
        descriptor.imports = [...descriptor.requires.values()]
            .flat()
            .filter(e => e.import.file != '')
            .map(e => e.import)
        ;
    }
}