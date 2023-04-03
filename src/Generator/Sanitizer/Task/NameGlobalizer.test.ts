import NameGlobalizer from './NameGlobalizer';
import path from 'path';
import StringHelper from '../../../StringHelper';
import DescriptorEntity, {ClassEntity, RequirementEntity} from '../../../DescriptorEntity';
import Spy = jasmine.Spy;

describe('NameGlobalizer', function (): void {
    let nameGlobalizer: NameGlobalizer,
        dirname: Spy<typeof path.dirname>
    ;

    beforeEach(function (): void {
        dirname = jasmine.createSpy<typeof path.dirname>();
        nameGlobalizer = new NameGlobalizer(
            dirname,
            new StringHelper()
        );
    });

    it('should make the name of given classes global non conflict-able', async function (): Promise<void> {
        dirname.and.returnValues(
            'root/src/Domain/Name',
            'root/src/OtherDomain',
            'root/src/OtherDomain'
        );

        const descriptor: DescriptorEntity = new DescriptorEntity('root/src/Domain/Name/Example');
        const requirement: RequirementEntity = new RequirementEntity(
            'test::replacedByClassPathToBeGlobalEqual:',
            'RequiredClass'
        );
        requirement.import.file = 'root/src/OtherDomain/RequiredClass';
        requirement.import.alias.name = 'RequiredClass';
        descriptor.requires.set('ExampleClass', [requirement]);
        const classItem: ClassEntity = new ClassEntity('ExampleClass');
        descriptor.provides = [classItem];

        nameGlobalizer.makeClassesGlobalUnique(descriptor, 'root/src');

        expect(dirname).toHaveBeenCalledWith('root/src/Domain/Name/Example');
        expect(classItem.name).toBe('DomainNameExampleClass');
        expect(descriptor.requires.get('DomainNameExampleClass')).toEqual([requirement]);
        expect(requirement.import.alias.name).toBe('OtherDomainRequiredClass');
        expect(requirement.parameter).toBe('otherDomainRequiredClass');
    });
});