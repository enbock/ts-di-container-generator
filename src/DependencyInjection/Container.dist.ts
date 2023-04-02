import Generator from '../Generator';
import StringHelper from '../StringHelper';
import InjectionExtractor from '../InjectionExtractor/InjectionExtractor';
import FileCreator from '../Generator/FileCreator';
import ClassParser from '../InjectionExtractor/Task/ClassParser';
import ImportParser from '../InjectionExtractor/Task/ImportParser';
import InterfaceParser from '../InjectionExtractor/Task/InterfaceParser';
import ContainerClassGenerator from '../Generator/ContainerClassGenerator';
import ContainerObjectGenerator from '../Generator/ContainerObjectGenerator';
import fs from 'fs';
import ParsingTask from '../InjectionExtractor/Task/ParsingTask';
import Sanitizer from '../Generator/Sanitizer/Sanitizer';
import RootDependencyParser from '../InjectionExtractor/Task/RootDependencyParser';
import path from 'path';
import GlobalImportRemover from '../Generator/Sanitizer/Task/GlobalImportRemover';
import PathResolver from '../Generator/Sanitizer/Task/PathResolver';
import IgnoredFileRemover from '../Generator/Sanitizer/Task/IgnoredFileRemover';
import RequirementResolver from '../Generator/Sanitizer/Task/RequirementResolver';
import ImportCleaner from '../Generator/Sanitizer/Task/ImportCleaner';
import NameGlobalizer from '../Generator/Sanitizer/Task/NameGlobalizer';

class Container {
    private readonly stringHelper: StringHelper = new StringHelper();
    private readonly classParser: ParsingTask = new ClassParser();
    private readonly importParser: ParsingTask = new ImportParser();
    private readonly interfaceParser: ParsingTask = new InterfaceParser();
    private readonly rootDependencyParser: ParsingTask = new RootDependencyParser();
    private readonly injectionExtractor: InjectionExtractor = new InjectionExtractor(
        [
            this.classParser,
            this.importParser,
            this.interfaceParser,
            this.rootDependencyParser
        ],
        path.resolve
    );
    private readonly containerClassGenerator: ContainerClassGenerator = new ContainerClassGenerator();
    private readonly objectGenerator: ContainerObjectGenerator = new ContainerObjectGenerator(
        this.stringHelper
    );
    private readonly fileCreator: FileCreator = new FileCreator(
        this.stringHelper,
        this.containerClassGenerator,
        this.objectGenerator,
        fs.promises.writeFile
    );
    private readonly pathSanitizer: Sanitizer = new Sanitizer(
        new GlobalImportRemover(),
        new PathResolver(
            path.dirname,
            path.resolve
        ),
        new IgnoredFileRemover(),
        new RequirementResolver(),
        new ImportCleaner(),
        new NameGlobalizer(
            path.dirname,
            this.stringHelper
        )
    );
    public generator: Generator = new Generator(
        this.stringHelper,
        this.injectionExtractor,
        this.fileCreator,
        this.pathSanitizer
    );
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;