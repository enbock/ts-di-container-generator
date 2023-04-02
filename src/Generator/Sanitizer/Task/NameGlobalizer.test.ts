import NameGlobalizer from './NameGlobalizer';
import path from 'path';
import StringHelper from '../../../StringHelper';
import DescriptorEntity, {ClassEntity} from '../../../DescriptorEntity';
import MockedObject from '../../../MockedObject';
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
        dirname.and.returnValue('root/src/Domain/Name');

        const descriptor: DescriptorEntity = new DescriptorEntity('root/src/Domain/Name/Example');
        descriptor.requires.set('ExampleClass', 'test::requirements:' as MockedObject);
        const classItem: ClassEntity = new ClassEntity('ExampleClass');
        descriptor.provides = [classItem];

        nameGlobalizer.makeClassesGlobalUnique(descriptor, 'root/src');

        expect(dirname).toHaveBeenCalledWith('root/src/Domain/Name/Example');
        expect(classItem.name).toBe('DomainNameExampleClass');
        expect(descriptor.requires.get('DomainNameExampleClass')).toBe('test::requirements:' as MockedObject);
    });
});