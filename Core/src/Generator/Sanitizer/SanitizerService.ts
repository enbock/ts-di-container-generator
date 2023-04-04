import DescriptorEntity from '../../DescriptorEntity';
import FileName from '../../File/FileName';
import GlobalImportRemover from './Task/GlobalImportRemover';
import IgnoredFileRemover from './Task/IgnoredFileRemover';
import RequirementResolver from './Task/RequirementResolver';
import ImportCleaner from './Task/ImportCleaner';
import NameGlobalizer from './Task/NameGlobalizer';
import FileClient from 'Core/File/FileClient';

export default class SanitizerService {
    constructor(
        private globalImportRemover: GlobalImportRemover,
        private fileClient: FileClient,
        private ignoredFileRemover: IgnoredFileRemover,
        private requirementResolver: RequirementResolver,
        private importCleaner: ImportCleaner,
        private nameGlobalizer: NameGlobalizer
    ) {
    }

    public sanitizeDescriptor(descriptor: DescriptorEntity, ignoreList: Array<FileName>, basePath: string): void {
        this.globalImportRemover.removeGlobals(descriptor);
        this.fileClient.makeImportPathsAbsolute(descriptor);
        this.ignoredFileRemover.removeIgnoredFiles(descriptor, ignoreList);
        this.requirementResolver.revolveRequiredImports(descriptor);
        this.importCleaner.removeUnneededImports(descriptor);
        this.nameGlobalizer.makeClassesGlobalUnique(descriptor, basePath);
    }
}