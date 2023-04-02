import Sanitizer from './Sanitizer';
import GlobalImportRemover from './Task/GlobalImportRemover';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import PathResolver from './Task/PathResolver';
import IgnoredFileRemover from './Task/IgnoredFileRemover';
import RequirementResolver from './Task/RequirementResolver';
import ImportCleaner from './Task/ImportCleaner';
import MockedObject from '../../MockedObject';

describe('Sanitizer', function (): void {
    let sanitizer: Sanitizer,
        globalImportRemover: Spy<GlobalImportRemover>,
        pathResolver: Spy<PathResolver>,
        ignoredFileRemover: Spy<IgnoredFileRemover>,
        requirementResolver: Spy<RequirementResolver>,
        importCleaner: Spy<ImportCleaner>
    ;

    beforeEach(function (): void {
        globalImportRemover = createSpyFromClass(GlobalImportRemover);
        pathResolver = createSpyFromClass(PathResolver);
        ignoredFileRemover = createSpyFromClass(IgnoredFileRemover);
        requirementResolver = createSpyFromClass(RequirementResolver);
        importCleaner = createSpyFromClass(ImportCleaner);

        sanitizer = new Sanitizer(
            globalImportRemover,
            pathResolver,
            ignoredFileRemover,
            requirementResolver,
            importCleaner
        );
    });

    it('should sanitize the import description', async function (): Promise<void> {
        sanitizer.sanitizeDescriptor('test::descriptor:' as MockedObject, 'test::ignoreList:' as MockedObject);

        expect(globalImportRemover.removeGlobals).toHaveBeenCalledWith('test::descriptor:');
        expect(pathResolver.makeImportPathsAbsolute).toHaveBeenCalledWith('test::descriptor:');
        expect(ignoredFileRemover.removeIgnoredFiles).toHaveBeenCalledWith('test::descriptor:', 'test::ignoreList:');
        expect(requirementResolver.revolveRequiredImports).toHaveBeenCalledWith('test::descriptor:');
        expect(importCleaner.removeUnneededImports).toHaveBeenCalledWith('test::descriptor:');
    });
});