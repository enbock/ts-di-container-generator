import FileExtractor, {ParameterBag} from './FileExtractor';
import {Spy} from 'jasmine-auto-spies';
import mock from 'Core/mock';
import FileClient, {FileError} from 'Core/File/FileClient';
import SanitizerService from 'Core/Generator/Sanitizer/SanitizerService';
import DescriptorEntity, {ImportEntity, RequirementEntity} from 'Core/DescriptorEntity';
import FailedDescriptorEntity from 'Core/Generator/Interactor/FailedDescriptorEntity';
import FileName from 'Core/File/FileName';
import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';

describe('FileExtractor', function (): void {
    let fileExtractor: FileExtractor,
        fileClient: Spy<FileClient>,
        sanitizerService: Spy<SanitizerService>
    ;

    beforeEach(function (): void {
        fileClient = mock<FileClient>();
        sanitizerService = mock<SanitizerService>();

        fileExtractor = new FileExtractor(
            fileClient,
            sanitizerService
        );
    });

    it('should handle FileErrors', function (): void {
        fileClient.extract.and.throwError(new FileError());

        const ignoreList: Array<FileName> = ['test::ignore'];
        const failedDescriptors: Array<FailedDescriptorEntity> = [];
        const descriptors: Array<DescriptorEntity> = [];

        fileExtractor.extract(
            'test::file',
            new ParameterBag('test::basePath', ignoreList, failedDescriptors, descriptors, new ConfigEntity())
        );

        expect(failedDescriptors.length).toBe(1);
        expect(failedDescriptors[0].basePath).toBe('test::basePath');
        expect(failedDescriptors[0].file).toBe('test::file');
    });

    it('should remove file from requirements and imports if there are no requirements', function (): void {
        const descriptor: DescriptorEntity = new DescriptorEntity('test::file');
        descriptor.requires = new Map();
        fileClient.extract.and.returnValue(descriptor);

        const ignoreList: Array<FileName> = ['test::ignore'];
        const failedDescriptors: Array<FailedDescriptorEntity> = [];
        const otherFile: DescriptorEntity = new DescriptorEntity('test::otherFile');
        otherFile.imports = [new ImportEntity('test::file')];
        const requirement: RequirementEntity = new RequirementEntity('');
        requirement.import.file = 'test::file';
        otherFile.requires.set('test::otherRequirements', [requirement]);
        const descriptors: Array<DescriptorEntity> = [otherFile];
        const config: ConfigEntity = new ConfigEntity();
        const pathAlias: PathAlias = new PathAlias();
        pathAlias.targetPath = 'test::alias';
        config.pathAliases = [pathAlias];
        fileExtractor.extract(
            'test::file',
            new ParameterBag('test::basePath', ignoreList, failedDescriptors, descriptors, config)
        );

        expect(sanitizerService.sanitizeDescriptor).toHaveBeenCalledWith(
            descriptor,
            ignoreList,
            'test::basePath',
            config
        );
        expect(requirement.import.file).toBe('');
        expect(otherFile.imports.length).toBe(0);
        expect(descriptors.length).toBe(1);
    });

    it('should extract descriptors recursively for each import', function (): void {
        const descriptor1: DescriptorEntity = new DescriptorEntity('test::file');
        const descriptor2: DescriptorEntity = new DescriptorEntity('test::file2');
        descriptor1.imports = [new ImportEntity('test::file2')];
        const requirement: RequirementEntity = new RequirementEntity('example');
        requirement.import = descriptor1.imports[0];
        descriptor1.requires.set('test::file1Requirements', [requirement]);
        descriptor2.imports = [];

        fileClient.extract.withArgs('test::basePath', 'test::file').and.returnValue(descriptor1);
        fileClient.extract.withArgs('test::basePath', 'test::file2').and.returnValue(descriptor2);

        const ignoreList: Array<FileName> = ['test::ignore'];
        const failedDescriptors: Array<FailedDescriptorEntity> = [];
        const descriptors: Array<DescriptorEntity> = [];

        fileExtractor.extract(
            'test::file',
            new ParameterBag('test::basePath', ignoreList, failedDescriptors, descriptors, new ConfigEntity())
        );
        expect(descriptors.length).toBe(1);
        expect(descriptors[0]).toBe(descriptor1);
    });
});