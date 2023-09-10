import ModulePathResolver from './ModulePathResolver';
import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';
import MockedObject from 'Core/MockedObject';
import createSpy = jasmine.createSpy;

describe('ModulePathResolver', function (): void {
    let resolveModulePath: ModulePathResolver,
        resolve: jasmine.Spy
    ;

    beforeEach(function (): void {
        resolve = createSpy();

        resolveModulePath = new ModulePathResolver(
            resolve
        );
    });

    it('should return resolved path when no global alias found', function (): void {
        const config: ConfigEntity = new ConfigEntity();
        const basePath: string = 'mock/basePath';
        const file: string = 'mock/file';

        resolve.and.returnValue('mock/resolvedPath');

        const result = resolveModulePath.resolvePath(basePath, file, config);

        expect(resolve).toHaveBeenCalledWith(basePath, file);
        expect(result).toBe('mock/resolvedPath');
    });

    it('should return resolved path with global alias', function (): void {
        const pathAlias: PathAlias = new PathAlias();
        pathAlias.regExp = /^mock\/file$/;
        pathAlias.targetPath = 'alias/targetPath';
        const config: ConfigEntity = {
            pathAliases: [pathAlias],
            basePath: '/mock/base' as MockedObject
        };
        const basePath: string = 'mock/basePath';
        const file: string = 'mock/file';

        resolve.and.returnValue('mock/resolvedPathWithAlias');

        const result = resolveModulePath.resolvePath(basePath, file, config);

        expect(resolve).toHaveBeenCalledWith(config.basePath, 'alias/targetPath');
        expect(result).toBe('mock/resolvedPathWithAlias');
    });

});