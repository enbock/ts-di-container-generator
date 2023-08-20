import TypeScript from './TypeScript';
import Parser from './Parser/Parser';
import fs from 'fs';
import {Node} from 'typescript';
import MockedObject from 'Core/MockedObject';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import ClassParser from './Parser/ClassParser';
import DescriptorEntity, {ImportEntity} from 'Core/DescriptorEntity';
import path from 'path';
import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';
import FileName from 'Core/File/FileName';

describe('TypeScript', function (): void {
    let fileClient: TypeScript,
        parser: Spy<Parser>,
        resolve: jasmine.Spy<typeof path.resolve>,
        dirname: jasmine.Spy<typeof path.dirname>,
        fileExistsSync: jasmine.Spy<typeof fs.existsSync>
    ;

    beforeAll(function (): void {
        const fd: number = fs.openSync('./TestFile.ts', 'w', 0o777);
        fs.writeSync(fd, 'class TestFile{}');
        fs.closeSync(fd);
    });

    afterAll(function (): void {
        fs.unlinkSync('./TestFile.ts');
    });

    beforeEach(function (): void {
        resolve = jasmine.createSpy<typeof path.resolve>();
        dirname = jasmine.createSpy<typeof path.dirname>();
        fileExistsSync = jasmine.createSpy<typeof fs.existsSync>();
        parser = createSpyFromClass(ClassParser);

        fileClient = new TypeScript(
            [parser],
            resolve,
            dirname,
            fileExistsSync
        );
    });

    it('should parse a file', async function (): Promise<void> {
        resolve.and.returnValue('./TestFile');
        parser.parse.and.callFake(function (node: Node, result: DescriptorEntity): void {
            result.provides = 'test::taskResult:' as MockedObject;
        });
        fileExistsSync.and.returnValue(true);

        const result: DescriptorEntity = fileClient.extract('test::dirname:', 'test::file:', new ConfigEntity());

        expect(resolve).toHaveBeenCalledWith('test::dirname:', 'test::file:');
        expect(result.file).toBe('./TestFile');
        expect(result.provides).toBe('test::taskResult:' as MockedObject);
    });

    it('should load file by global path alias', function (): void {
        const pathAlias: PathAlias = new PathAlias();
        pathAlias.regExp = /test::alias\//;
        pathAlias.targetPath = 'test::target/path/';
        const config: ConfigEntity = new ConfigEntity();
        config.pathAliases = [pathAlias];
        config.basePath = 'test::globalBasePath';
        fileExistsSync.and.returnValue(true);

        const file: FileName = 'test::alias/test::FileName';
        resolve
            .withArgs('test::globalBasePath', 'test::target/path/test::FileName')
            .and
            .returnValue('./TestFile')
        ;

        const descriptor: DescriptorEntity = fileClient.extract('test::dirname:', file, config);

        expect(fileExistsSync).toHaveBeenCalledWith('./TestFile.ts');
        expect(descriptor).toBeInstanceOf(DescriptorEntity);
        expect(descriptor.file).toBe('./TestFile');
    });

    it('should make the import paths absolute', async function (): Promise<void> {
        dirname.and.returnValue('test::dirname:');
        resolve.and.returnValue('test::resolvedFile:');
        const descriptor: DescriptorEntity = new DescriptorEntity('test::basingPath:');
        descriptor.imports = [new ImportEntity('test::file:')];

        fileClient.makeImportPathsAbsolute(descriptor, new ConfigEntity());

        expect(dirname).toHaveBeenCalledWith('test::basingPath:');
        expect(resolve).toHaveBeenCalledWith('test::dirname:', 'test::file:');
        expect(descriptor.imports[0].file).toBe('test::resolvedFile:');
    });

    it('should make the import paths absolute by using global imports', async function (): Promise<void> {
        dirname.and.returnValue('test::dirname:');
        resolve.withArgs('test::globalBasePath', 'test::target/path/test::file:')
            .and
            .returnValue('test::resolvedFile:');
        const descriptor: DescriptorEntity = new DescriptorEntity('test::basingPath:');
        descriptor.imports = [new ImportEntity('test::alias/test::file:')];

        const pathAlias: PathAlias = new PathAlias();
        pathAlias.regExp = /test::alias\//;
        pathAlias.targetPath = 'test::target/path/';
        const config: ConfigEntity = new ConfigEntity();
        config.pathAliases = [pathAlias];
        config.basePath = 'test::globalBasePath';

        fileClient.makeImportPathsAbsolute(descriptor, config);

        expect(dirname).toHaveBeenCalledWith('test::basingPath:');
        expect(resolve).toHaveBeenCalledWith('test::globalBasePath', 'test::target/path/test::file:');
        expect(descriptor.imports[0].file).toBe('test::resolvedFile:');
    });
});
