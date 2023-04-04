import GlobalImportRemover from './GlobalImportRemover';
import DescriptorEntity, {AliasEntity, ImportEntity} from '../../../DescriptorEntity';

describe('GlobalImportRemover', function (): void {
    let globalImportRemover: GlobalImportRemover;

    beforeEach(function (): void {
        globalImportRemover = new GlobalImportRemover();
    });

    it('should remove global imports', async function (): Promise<void> {
        const descriptor: DescriptorEntity = new DescriptorEntity('');
        let projectFileExample: ImportEntity = new ImportEntity('../../Project/File', new AliasEntity('File', ''));
        let otherFileExample: ImportEntity = new ImportEntity('./OtherFile', new AliasEntity('OtherFile', ''));
        descriptor.imports = [
            new ImportEntity('global-import', new AliasEntity('globalImport', '*')),
            projectFileExample,
            otherFileExample
        ];

        globalImportRemover.removeGlobals(descriptor);

        expect(descriptor.imports).toEqual([projectFileExample, otherFileExample]);
    });
});