import ImportCleaner from './ImportCleaner';
import DescriptorEntity, {ImportEntity, RequirementEntity} from '../../../DescriptorEntity';

describe('ImportCleaner', function (): void {
    let importCleaner: ImportCleaner;

    beforeEach(function (): void {
        importCleaner = new ImportCleaner();
    });

    it('should remove non dependency required import', async function (): Promise<void> {
        const descriptor: DescriptorEntity = new DescriptorEntity('');
        let neededImport: ImportEntity = new ImportEntity('./needed');
        let unneededImport: ImportEntity = new ImportEntity('./not-needed');
        descriptor.imports = [
            unneededImport,
            neededImport
        ];
        const requirement: RequirementEntity = new RequirementEntity('requiredParameter', '', false);
        requirement.import = neededImport;
        descriptor.requires.set(
            'SomeClass', [
                requirement
            ]
        );

        importCleaner.replaceImportsByRequirements(descriptor);

        expect(descriptor.imports).toEqual([neededImport]);
    });
});