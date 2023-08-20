import DescriptorEntity, {ImportEntity} from '../../../DescriptorEntity';
import ConfigEntity from 'Core/Configuration/ConfigEntity';

export default class GlobalImportRemover {
    public removeGlobals(descriptor: DescriptorEntity, config: ConfigEntity): void {
        descriptor.imports = descriptor.imports.filter(
            (i: ImportEntity): boolean =>
                i.file.substring(0, 2) == './'
                || i.file.substring(0, 3) == '../'
                || config.pathAliases.find(pa => pa.regExp.test(i.file)) !== undefined
        );
    }
}