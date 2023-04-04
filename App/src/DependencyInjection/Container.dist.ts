import Generator from '../Generator';
import StringHelper from 'Core/StringHelper';
import InjectionExtractor from '../InjectionExtractor/InjectionExtractor';
import Controller from '../Controller/Controller';
import ClassParser from '../InjectionExtractor/Task/ClassParser';
import ImportParser from '../InjectionExtractor/Task/ImportParser';
import InterfaceParser from '../InjectionExtractor/Task/InterfaceParser';
import ContainerClassGenerator from 'Core/Generator/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/ContainerObjectGenerator';
import fs from 'fs';
import ParsingTask from '../InjectionExtractor/Task/ParsingTask';
import Sanitizer from 'Core/Generator/Sanitizer/Sanitizer';
import RootDependencyParser from '../InjectionExtractor/Task/RootDependencyParser';
import path from 'path';
import GlobalImportRemover from 'Core/Generator/Sanitizer/Task/GlobalImportRemover';
import PathResolver from 'Core/Generator/Sanitizer/Task/PathResolver';
import IgnoredFileRemover from 'Core/Generator/Sanitizer/Task/IgnoredFileRemover';
import RequirementResolver from 'Core/Generator/Sanitizer/Task/RequirementResolver';
import ImportCleaner from 'Core/Generator/Sanitizer/Task/ImportCleaner';
import NameGlobalizer from 'Core/Generator/Sanitizer/Task/NameGlobalizer';
import ImportGenerator from 'Core/Generator/ImportGenerator';
import Presenter from '../Controller/Presenter';
import GeneratorInteractor from 'Core/Generator/Interactor/Interactor';

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
    private readonly importGenerator: ImportGenerator = new ImportGenerator(
        path.dirname
    );
    private readonly generatorInteractor: GeneratorInteractor = new GeneratorInteractor(
        this.stringHelper,
        this.containerClassGenerator,
        this.objectGenerator,
        this.importGenerator
    );
    private readonly controller: Controller = new Controller(
        this.generatorInteractor,
        new Presenter(
            this.stringHelper,
            fs.promises.writeFile
        )
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
        this.controller,
        this.pathSanitizer
    );
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;