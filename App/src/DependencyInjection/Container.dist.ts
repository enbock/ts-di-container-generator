import StringHelper from 'Core/StringHelper';
import TypeScript from 'Infrastructure/File/TypeScript';
import Controller from '../Controller/Controller';
import ClassParser from 'Infrastructure/File/Parser/ClassParser';
import ImportParser from 'Infrastructure/File/Parser/ImportParser';
import InterfaceParser from 'Infrastructure/File/Parser/InterfaceParser';
import ContainerClassGenerator from 'Core/Generator/Interactor/Task/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/Interactor/Task/ContainerObjectGenerator';
import fs from 'fs';
import Parser from 'Infrastructure/File/Parser/Parser';
import SanitizerService from 'Core/Generator/Sanitizer/SanitizerService';
import RootDependencyParser from 'Infrastructure/File/Parser/RootDependencyParser';
import path from 'path';
import GlobalImportRemover from 'Core/Generator/Sanitizer/Task/GlobalImportRemover';
import IgnoredFileRemover from 'Core/Generator/Sanitizer/Task/IgnoredFileRemover';
import RequirementResolver from 'Core/Generator/Sanitizer/Task/RequirementResolver';
import ImportCleaner from 'Core/Generator/Sanitizer/Task/ImportCleaner';
import NameGlobalizer from 'Core/Generator/Sanitizer/Task/NameGlobalizer';
import ImportGenerator from 'Core/Generator/Interactor/Task/ImportGenerator';
import Presenter from '../Controller/Presenter';
import GeneratorInteractor from 'Core/Generator/Interactor/Interactor';
import FileExtractor from 'Core/Generator/Interactor/Task/FileExtractor';

class Container {
    private readonly stringHelper: StringHelper = new StringHelper();
    private readonly classParser: Parser = new ClassParser();
    private readonly importParser: Parser = new ImportParser();
    private readonly interfaceParser: Parser = new InterfaceParser();
    private readonly rootDependencyParser: Parser = new RootDependencyParser();
    private readonly fileClient: TypeScript = new TypeScript(
        [
            this.classParser,
            this.importParser,
            this.interfaceParser,
            this.rootDependencyParser
        ],
        path.resolve,
        path.dirname,
        fs.existsSync
    );
    private readonly containerClassGenerator: ContainerClassGenerator = new ContainerClassGenerator();
    private readonly objectGenerator: ContainerObjectGenerator = new ContainerObjectGenerator(
        this.stringHelper
    );
    private readonly importGenerator: ImportGenerator = new ImportGenerator(
        path.dirname
    );
    private readonly pathSanitizer: SanitizerService = new SanitizerService(
        new GlobalImportRemover(),
        this.fileClient,
        new IgnoredFileRemover(),
        new RequirementResolver(),
        new ImportCleaner(),
        new NameGlobalizer(
            path.dirname,
            this.stringHelper
        )
    );
    private readonly generatorInteractor: GeneratorInteractor = new GeneratorInteractor(
        this.stringHelper,
        this.containerClassGenerator,
        this.objectGenerator,
        this.importGenerator,
        new FileExtractor(
            this.fileClient
        ),
        this.pathSanitizer
    );
    private readonly presenter: Presenter = new Presenter(
        this.stringHelper,
        fs.promises.writeFile,
        path.resolve
    );
    public readonly controller: Controller = new Controller(
        this.generatorInteractor,
        this.presenter
    );
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;