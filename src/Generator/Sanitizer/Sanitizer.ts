import DescriptorEntity from '../../DescriptorEntity';
import FileName from '../../FileName';
import PathResolver from './Task/PathResolver';
import GlobalImportRemover from './Task/GlobalImportRemover';
import IgnoredFileRemover from './Task/IgnoredFileRemover';
import RequirementResolver from './Task/RequirementResolver';
import ImportCleaner from './Task/ImportCleaner';

export default class Sanitizer {
    constructor(
        private globalImportRemover: GlobalImportRemover,
        private pathResolver: PathResolver,
        private ignoredFileRemover: IgnoredFileRemover,
        private requirementResolver: RequirementResolver,
        private importCleaner: ImportCleaner
    ) {
    }

    public sanitizeDescriptor(descriptor: DescriptorEntity, ignoreList: Array<FileName>): void {
        this.globalImportRemover.removeGlobals(descriptor);
        this.pathResolver.makeImportPathsAbsolute(descriptor);
        this.ignoredFileRemover.removeIgnoredFiles(descriptor, ignoreList);
        this.requirementResolver.revolveRequiredImports(descriptor);
        this.importCleaner.removeUnneededImports(descriptor);
    }
}