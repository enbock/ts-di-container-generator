import DescriptorEntity, {ImportEntity} from '../../../DescriptorEntity';

export default class GlobalImportRemover {
    public removeGlobals(descriptor: DescriptorEntity): void {
        descriptor.imports = descriptor.imports.filter(
            (i: ImportEntity): boolean => i.file.substring(0, 2) == './' || i.file.substring(0, 3) == '../'
        );
    }
}