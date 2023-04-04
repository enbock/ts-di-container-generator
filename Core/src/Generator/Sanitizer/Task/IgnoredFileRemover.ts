import DescriptorEntity, {ImportEntity} from '../../../DescriptorEntity';
import FileName from '../../../FileName';

export default class IgnoredFileRemover {
    public removeIgnoredFiles(descriptor: DescriptorEntity, ignoreList: Array<FileName>): void {
        descriptor.imports = descriptor.imports.filter(
            (i: ImportEntity): boolean => ignoreList.find(
                (bl: string): boolean => {
                    const pattern: any = bl.replace(/[\/\\]/g, '.');
                    return i.file.match(pattern) != null;
                }
            ) == undefined
        );
    }
}