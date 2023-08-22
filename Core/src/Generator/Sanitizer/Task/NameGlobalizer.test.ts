import NameGlobalizer from './NameGlobalizer';
import path from 'path';
import StringHelper from '../../../StringHelper';
import DescriptorEntity, {ClassEntity, RequirementEntity} from '../../../DescriptorEntity';
import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';
import Spy = jasmine.Spy;

describe('NameGlobalizer', function (): void {
    let nameGlobalizer: NameGlobalizer,
        dirname: Spy<typeof path.dirname>,
        normalize: Spy<typeof path.normalize>
    ;

    beforeEach(function (): void {
        dirname = jasmine.createSpy<typeof path.dirname>();
        normalize = jasmine.createSpy<typeof path.normalize>();
        nameGlobalizer = new NameGlobalizer(
            dirname,
            new StringHelper(),
            normalize
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
        const classItem: ClassEntity = new ClassEntity('ExampleClass', true);
        descriptor.provides = [classItem];
        normalize.and.callFake(x => x);

        nameGlobalizer.makeClassesGlobalUnique(descriptor, 'root/src', new ConfigEntity());

        expect(dirname).toHaveBeenCalledWith('root/src/Domain/Name/Example');
        expect(classItem.name).toBe('DomainNameExampleClass');
        expect(descriptor.requires.get('DomainNameExampleClass')).toEqual([requirement]);
        expect(requirement.import.alias.name).toBe('OtherDomainRequiredClass');
        expect(requirement.parameter).toBe('otherDomainRequiredClass');
    });

    it(
        'should make the name of given classes global non conflict-able for aliased imports',
        async function (): Promise<void> {
            dirname.and.returnValues('root/Global/src/Domain/Name');

            const pathAlias: PathAlias = new PathAlias();
            pathAlias.regExp = /^Global\//;
            pathAlias.name = 'Global/';
            pathAlias.targetPath = 'Global/src';
            const config: ConfigEntity = new ConfigEntity();
            config.pathAliases = [pathAlias];
            config.basePath = 'root';

            const descriptor: DescriptorEntity = new DescriptorEntity('root/Global/src/Domain/Name/Example');
            const classItem: ClassEntity = new ClassEntity('ExampleClass', true);
            descriptor.provides = [classItem];

            normalize.and.callFake(x => x.replace('//', '/'));

            nameGlobalizer.makeClassesGlobalUnique(descriptor, 'root/src', config);

            expect(dirname).toHaveBeenCalledWith('root/Global/src/Domain/Name/Example');
            expect(classItem.name).toBe('GlobalDomainNameExampleClass');
        }
    );
});