import SanitizerService from './SanitizerService';
import GlobalImportRemover from './Task/GlobalImportRemover';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import IgnoredFileRemover from './Task/IgnoredFileRemover';
import RequirementResolver from './Task/RequirementResolver';
import ImportCleaner from './Task/ImportCleaner';
import MockedObject from '../../MockedObject';
import NameGlobalizer from './Task/NameGlobalizer';
import FileClient from 'Core/File/FileClient';
import FallbackRequireNameCreator from 'Core/Generator/Sanitizer/Task/FallbackRequireNameCreator';
import mock from 'Core/mock';

describe('SanitizerService', function (): void {
    let sanitizer: SanitizerService,
        globalImportRemover: Spy<GlobalImportRemover>,
        fileClient: Spy<FileClient>,
        ignoredFileRemover: Spy<IgnoredFileRemover>,
        requirementResolver: Spy<RequirementResolver>,
        importCleaner: Spy<ImportCleaner>,
        nameGlobalizer: Spy<NameGlobalizer>,
        fallbackRequireNameCreator: Spy<FallbackRequireNameCreator>
    ;

    beforeEach(function (): void {
        globalImportRemover = createSpyFromClass(GlobalImportRemover);
        fileClient = mock<FileClient>();
        ignoredFileRemover = createSpyFromClass(IgnoredFileRemover);
        requirementResolver = createSpyFromClass(RequirementResolver);
        importCleaner = createSpyFromClass(ImportCleaner);
        nameGlobalizer = createSpyFromClass(NameGlobalizer);
        fallbackRequireNameCreator = createSpyFromClass(FallbackRequireNameCreator);

        sanitizer = new SanitizerService(
            globalImportRemover,
            fileClient,
            ignoredFileRemover,
            requirementResolver,
            importCleaner,
            nameGlobalizer,
            fallbackRequireNameCreator
        );
    });

    it('should sanitize the import description', async function (): Promise<void> {
        sanitizer.sanitizeDescriptor(
            'test::descriptor:' as MockedObject,
            'test::ignoreList:' as MockedObject,
            'test::basePath:',
            'test::config' as MockedObject
        );

        expect(globalImportRemover.removeGlobals).toHaveBeenCalledWith('test::descriptor:');
        expect(fileClient.makeImportPathsAbsolute).toHaveBeenCalledWith('test::descriptor:');
        expect(ignoredFileRemover.removeIgnoredFiles).toHaveBeenCalledWith('test::descriptor:', 'test::ignoreList:');
        expect(requirementResolver.revolveRequiredImports).toHaveBeenCalledWith('test::descriptor:');
        expect(importCleaner.removeUnneededImports).toHaveBeenCalledWith('test::descriptor:');
        expect(nameGlobalizer.makeClassesGlobalUnique).toHaveBeenCalledWith('test::descriptor:', 'test::basePath:');
        expect(fallbackRequireNameCreator.addRequireName).toHaveBeenCalledWith('test::descriptor:', 'test::basePath:');
    });
});