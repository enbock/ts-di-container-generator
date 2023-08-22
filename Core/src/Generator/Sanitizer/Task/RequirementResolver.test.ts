import RequirementResolver from './RequirementResolver';
import DescriptorEntity, {AliasEntity, ImportEntity, RequirementEntity} from '../../../DescriptorEntity';

describe('RequirementResolver', function (): void {
    let requirementResolver: RequirementResolver;

    beforeEach(function (): void {
        requirementResolver = new RequirementResolver();
    });

    it('should find and add import for a requirement', async function (): Promise<void> {
        const descriptor: DescriptorEntity = new DescriptorEntity('test::basingPath:');
        const neededImport: ImportEntity = new ImportEntity('test::file:', new AliasEntity('test::alias:'));
        descriptor.imports = [neededImport];
        const requirement: RequirementEntity = new RequirementEntity('test::name:', 'test::alias:');
        descriptor.requires.set('any', [requirement]);

        requirementResolver.revolveRequiredImports(descriptor);

        expect(requirement.import).toBe(neededImport);
    });
});