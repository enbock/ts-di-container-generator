import IgnoredFileRemover from './IgnoredFileRemover';
import DescriptorEntity, {AliasEntity, ImportEntity} from '../../../DescriptorEntity';

describe('IgnoredFileRemover', function (): void {
    let ignoredFileRemover: IgnoredFileRemover;

    beforeEach(function (): void {
        ignoredFileRemover = new IgnoredFileRemover();
    });

    it('should remove ignored imports', async function (): Promise<void> {
        const descriptor: DescriptorEntity = new DescriptorEntity('');
        let otherFileExample: ImportEntity = new ImportEntity('./OtherFile', new AliasEntity('OtherFile', ''));
        descriptor.imports = [
            new ImportEntity('that/should/ignore/me/here'),
            new ImportEntity('that\\should\\ignore\\me\\here'),
            new ImportEntity('that/should/ignore/me/too'),
            new ImportEntity('that\\should\\ignore\\me\\too'),
            otherFileExample
        ];

        ignoredFileRemover.removeIgnoredFiles(descriptor, ['ignore/me', 'me\\too']);

        expect(descriptor.imports).toEqual([otherFileExample]);
    });
});