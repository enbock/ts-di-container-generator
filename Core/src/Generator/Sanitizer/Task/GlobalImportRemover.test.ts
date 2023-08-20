import GlobalImportRemover from './GlobalImportRemover';
import DescriptorEntity, {AliasEntity, ImportEntity} from '../../../DescriptorEntity';
import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';

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

        globalImportRemover.removeGlobals(descriptor, new ConfigEntity());

        expect(descriptor.imports).toEqual([projectFileExample, otherFileExample]);
    });

    it('should keep path aliased imports', async function (): Promise<void> {
        const descriptor: DescriptorEntity = new DescriptorEntity('');
        const pathAliasedImport: ImportEntity = new ImportEntity(
            'alias/PathAliasedImport',
            new AliasEntity('PathAliasedImport', '')
        );
        const localImport: ImportEntity = new ImportEntity('../LocalImport', new AliasEntity('filename', ''));
        descriptor.imports = [
            new ImportEntity('global-import', new AliasEntity('globalImport', '*')),
            pathAliasedImport,
            localImport
        ];

        const config: ConfigEntity = new ConfigEntity();
        const pathAlias: PathAlias = new PathAlias();
        pathAlias.regExp = new RegExp('alias');
        pathAlias.targetPath = '/root/alias';
        config.pathAliases = [pathAlias];

        globalImportRemover.removeGlobals(descriptor, config);

        expect(descriptor.imports).toEqual([
            pathAliasedImport,
            localImport
        ]);
    });
});