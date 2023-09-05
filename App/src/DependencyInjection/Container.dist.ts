import StringHelper from 'Core/StringHelper';
import FileTypeScript from 'Infrastructure/File/TypeScript';
import Controller from '../Controller/Controller';
import ClassParser from 'Infrastructure/File/Parser/ClassParser';
import ImportParser from 'Infrastructure/File/Parser/ImportParser';
import InterfaceParser from 'Infrastructure/File/Parser/InterfaceParser';
import ContainerClassGenerator from 'Core/Generator/Interactor/Task/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/Interactor/Task/ContainerObjectGenerator';
import fs from 'fs';
import FileParser from 'Infrastructure/File/Parser/Parser';
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
import FallbackRequireNameCreator from 'Core/Generator/Sanitizer/Task/FallbackRequireNameCreator';
import LanguageConfigUseCase from 'Core/Configuration/LanguageConfigUseCase/LanguageConfigUseCase';
import ConfigTypeScript from 'Infrastructure/Config/TypeScript';
import fsPromises from 'fs/promises';
import ConfigParser from 'Infrastructure/Config/Parser';
import ParseHelper from 'Infrastructure/ParseHelper';
import * as process from 'process';
import InterfacePropertyGenerator from 'Core/Generator/Interactor/Task/InterfacePropertyGenerator';
import NamedInterfaceParser from 'Infrastructure/File/Parser/NamedInterfaceParser';
import ManualCodeUseCase from 'Core/ManualCodeUseCase/ManualCodeUseCase';

class Container {
    private stringHelper: StringHelper = new StringHelper();
    private classParser: FileParser = new ClassParser();
    private importParser: FileParser = new ImportParser();
    private interfaceParser: FileParser = new InterfaceParser();
    private rootDependencyParser: FileParser = new RootDependencyParser();
    private fileClient: FileTypeScript = new FileTypeScript(
        [
            this.classParser,
            this.importParser,
            this.interfaceParser,
            this.rootDependencyParser
        ],
        path.resolve,
        path.dirname,
        fs.existsSync,
        new NamedInterfaceParser()
    );
    private containerClassGenerator: ContainerClassGenerator = new ContainerClassGenerator();
    private objectGenerator: ContainerObjectGenerator = new ContainerObjectGenerator(
        this.stringHelper
    );
    private importGenerator: ImportGenerator = new ImportGenerator(
        path.resolve,
        path.relative,
        path.normalize
    );
    private pathSanitizer: SanitizerService = new SanitizerService(
        new GlobalImportRemover(),
        this.fileClient,
        new IgnoredFileRemover(),
        new RequirementResolver(),
        new ImportCleaner(),
        new NameGlobalizer(
            path.dirname,
            this.stringHelper,
            path.normalize
        ),
        new FallbackRequireNameCreator(
            path.dirname,
            this.stringHelper
        )
    );
    private generatorInteractor: GeneratorInteractor = new GeneratorInteractor(
        this.containerClassGenerator,
        this.objectGenerator,
        this.importGenerator,
        new FileExtractor(
            this.fileClient,
            this.pathSanitizer
        ),
        new InterfacePropertyGenerator(this.stringHelper)
    );
    private presenter: Presenter = new Presenter(
        this.stringHelper,
        fs.promises.writeFile,
        path.resolve
    );
    private parseHelper: ParseHelper = new ParseHelper();
    public controllerController: Controller = new Controller(
        this.generatorInteractor,
        this.presenter,
        new LanguageConfigUseCase(
            new ConfigTypeScript(
                fs.existsSync,
                fsPromises.readFile,
                new ConfigParser(
                    this.parseHelper,
                    path.resolve
                ),
                process.cwd,
                path.resolve
            )
        ),
        new ManualCodeUseCase(
            this.fileClient,
            [
                'ManualInjections',
                'InterfaceInstances',
                'AdditionalResources'
            ]
        )
    );
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;