import PathResolver from './PathResolver';
import path from 'path';
import DescriptorEntity, {ImportEntity} from '../../../DescriptorEntity';
import Spy = jasmine.Spy;

describe('PathResolver', function (): void {
    let pathResolver: PathResolver,
        dirname: Spy<typeof path.dirname>,
        resolve: Spy<typeof path.resolve>
    ;

    beforeEach(function (): void {
        dirname = jasmine.createSpy<typeof path.dirname>();
        resolve = jasmine.createSpy<typeof path.resolve>();

        pathResolver = new PathResolver(
            dirname,
            resolve
        );
    });

    it('should make the import paths absolute', async function (): Promise<void> {
        dirname.and.returnValue('test::dirname:');
        resolve.and.returnValue('test::resolvedFile:');
        const descriptor: DescriptorEntity = new DescriptorEntity('test::basingPath:');
        descriptor.imports = [new ImportEntity('test::file:')];

        pathResolver.makeImportPathsAbsolute(descriptor);

        expect(dirname).toHaveBeenCalledWith('test::basingPath:');
        expect(resolve).toHaveBeenCalledWith('test::dirname:', 'test::file:');
        expect(descriptor.imports[0].file).toBe('test::resolvedFile:');
    });
});