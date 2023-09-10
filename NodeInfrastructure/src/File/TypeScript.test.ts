import TypeScript from './TypeScript';
import Parser from './Parser/Parser';
import ts, {Node, SourceFile} from 'typescript';
import MockedObject from 'Core/MockedObject';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import ClassParser from './Parser/ClassParser';
import DescriptorEntity, {ImportEntity} from 'Core/DescriptorEntity';
import path from 'path';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import InterfaceExtractor from 'Infrastructure/File/Parser/InterfaceExtractor';
import mock from 'Core/mock';
import PropertyExtractor from 'Infrastructure/File/Parser/PropertyExtractor';
import ClassConstructorExtractor from 'Infrastructure/File/Parser/ClassConstructorExtractor';
import FileLoader from 'Infrastructure/File/Task/FileLoader';
import ModulePathResolver from 'Infrastructure/File/Task/ModulePathResolver';
import NodeEntity from 'Core/File/NodeEntity';

describe('TypeScript', function (): void {
    let fileClient: TypeScript,
        parser: Spy<Parser>,
        parsers: Parser[],
        dirname: jasmine.Spy<typeof path.dirname>,
        interfaceExtractor: Spy<InterfaceExtractor>,
        propertyExtractor: Spy<PropertyExtractor>,
        classConstructorExtractor: Spy<ClassConstructorExtractor>,
        loadFile: Spy<FileLoader>,
        modulePathResolver: Spy<ModulePathResolver>
    ;

    beforeEach(function (): void {
        parser = createSpyFromClass(ClassParser);
        parsers = [parser];
        dirname = jasmine.createSpy<typeof path.dirname>();
        interfaceExtractor = mock<InterfaceExtractor>();
        propertyExtractor = mock<PropertyExtractor>();
        classConstructorExtractor = mock<ClassConstructorExtractor>();
        loadFile = mock<FileLoader>();
        modulePathResolver = mock<ModulePathResolver>();

        fileClient = new TypeScript(
            parsers,
            dirname,
            interfaceExtractor,
            propertyExtractor,
            classConstructorExtractor,
            loadFile,
            modulePathResolver
        );
    });

    it('should parse a file', async function (): Promise<void> {
        const sourceFile: SourceFile = ts.createSourceFile('./TestFile.ts', 'class TestFile{}', 99);

        modulePathResolver.resolvePath.and.returnValue('./TestFile');
        parser.parse.and.callFake(function (node: Node, result: DescriptorEntity): void {
            result.provides = 'test::taskResult:' as MockedObject;
        });
        loadFile.loadFile.and.returnValue(sourceFile);

        const result: DescriptorEntity = fileClient.extract('test::dirname:', 'test::file:', new ConfigEntity());

        expect(modulePathResolver.resolvePath).toHaveBeenCalledWith(
            'test::dirname:',
            'test::file:',
            new ConfigEntity()
        );
        expect(result.file).toBe('./TestFile');
        expect(result.provides).toBe('test::taskResult:' as MockedObject);
    });

    it('should make the import paths absolute', async function (): Promise<void> {
        dirname.and.returnValue('test::dirname:');
        modulePathResolver.resolvePath.and.returnValue('test::resolvedFile:');
        const descriptor: DescriptorEntity = new DescriptorEntity('test::basingPath:');
        descriptor.imports = [new ImportEntity('test::file:')];

        fileClient.makeImportPathsAbsolute(descriptor, new ConfigEntity());

        expect(dirname).toHaveBeenCalledWith('test::basingPath:');
        expect(modulePathResolver.resolvePath).toHaveBeenCalledWith(
            'test::dirname:',
            'test::file:',
            new ConfigEntity()
        );
        expect(descriptor.imports[0].file).toBe('test::resolvedFile:');
    });

    it('should make the import paths absolute by using global imports', async function (): Promise<void> {
        dirname.and.returnValue('test::dirname:');
        modulePathResolver.resolvePath.and.returnValue('test::resolvedFile:');
        const descriptor: DescriptorEntity = new DescriptorEntity('test::basingPath:');
        const importEntity: ImportEntity = new ImportEntity('test::file:');
        descriptor.imports = [importEntity];

        fileClient.makeImportPathsAbsolute(descriptor, 'test::config' as MockedObject);

        expect(dirname).toHaveBeenCalledWith('test::basingPath:');
        expect(modulePathResolver.resolvePath).toHaveBeenCalledWith(
            'test::dirname:',
            'test::file:',
            'test::config'
        );
        expect(descriptor.imports[0].file).toBe('test::resolvedFile:');
    });

    it('should extract interface when file and source exist', function (): void {
        let wasFound: boolean = false;
        const sourceFile: SourceFile = ts.createSourceFile('./TestFile.ts', 'interface TestInterface{}', 99);

        loadFile.loadFile.and.returnValue(sourceFile);
        modulePathResolver.resolvePath.and.returnValue('./TestInterfaceFile');

        interfaceExtractor.parse.and.callFake(
            function parse(node: Node, result: NodeEntity, requestedName: string): void {
                if (wasFound) return;
                expect(ts.isInterfaceDeclaration(node)).toBeTrue();
                expect(requestedName).toBe('TestInterfaceFile');
                result.name = 'test::name';
                wasFound = true;
            }
        );

        const result: NodeEntity = fileClient.extractInterface(
            'test::basePath',
            'test::FileName',
            'TestInterfaceFile'
        );

        expect(loadFile.loadFile).toHaveBeenCalledWith('./TestInterfaceFile');
        expect(result.name).toBe('test::name');
    });

    it('should return empty node when file does not exist', function (): void {
        const result: NodeEntity = fileClient.extractContainerConstructor('test::basePath', 'test::containerFile');

        expect(ts.isConstructorDeclaration(result.node)).toBeTrue();
    });

    it('should return constructor node data', function (): void {
        let wasFound: boolean = false;
        const sourceFile: SourceFile = ts.createSourceFile('./TestFile.ts', 'class Container{}', 99);

        loadFile.loadFile.and.returnValue(sourceFile);
        modulePathResolver.resolvePath.and.returnValue('./TestInterfaceFile');

        classConstructorExtractor.parse.and.callFake(
            function parse(node: ts.Node, result: NodeEntity, className: string): void {
                if (wasFound) return;
                wasFound = true;
                expect(ts.isClassDeclaration(node)).toBeTrue();
                result.node = 'test::tsNode' as MockedObject;
                expect(className).toBe('Container');
            }
        );

        const result: NodeEntity = fileClient.extractContainerConstructor('test::basePath', 'test::file');

        expect(result.node).toEqual('test::tsNode' as MockedObject);
        expect(result.name).toBe('constructor');
    });
});
