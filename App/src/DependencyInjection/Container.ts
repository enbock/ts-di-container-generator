// @formatter:off
import InfrastructureParseHelper from 'Infrastructure/ParseHelper';
import InfrastructureConfigParser from 'Infrastructure/Config/Parser';
import InfrastructureFileParserInterfaceExtractor from 'Infrastructure/File/Parser/InterfaceExtractor';
import InfrastructureFileParserPropertyExtractor from 'Infrastructure/File/Parser/PropertyExtractor';
import InfrastructureFileParserClassConstructorExtractor from 'Infrastructure/File/Parser/ClassConstructorExtractor';
import InfrastructureFileTaskFileLoader from 'Infrastructure/File/Task/FileLoader';
import InfrastructureFileTaskModulePathResolver from 'Infrastructure/File/Task/ModulePathResolver';
import CoreFileFileClient from 'Core/File/FileClient';
import CoreConfigurationConfigClient from 'Core/Configuration/ConfigClient';
import CoreGeneratorInteractorTaskFileExtractor from 'Core/Generator/Interactor/Task/FileExtractor';
import CoreStringHelper from 'Core/StringHelper';
import CoreGeneratorSanitizerTaskGlobalImportRemover from 'Core/Generator/Sanitizer/Task/GlobalImportRemover';
import CoreGeneratorSanitizerTaskIgnoredFileRemover from 'Core/Generator/Sanitizer/Task/IgnoredFileRemover';
import CoreGeneratorSanitizerTaskRequirementResolver from 'Core/Generator/Sanitizer/Task/RequirementResolver';
import CoreGeneratorSanitizerTaskImportCleaner from 'Core/Generator/Sanitizer/Task/ImportCleaner';
import CoreGeneratorSanitizerTaskNameGlobalizer from 'Core/Generator/Sanitizer/Task/NameGlobalizer';
import CoreGeneratorSanitizerTaskFallbackRequireNameCreator from 'Core/Generator/Sanitizer/Task/FallbackRequireNameCreator';
import CoreConfigurationConfigEntity from 'Core/Configuration/ConfigEntity';
import CoreGeneratorSanitizerSanitizerService from 'Core/Generator/Sanitizer/SanitizerService';
import CoreGeneratorInteractorTaskContainerClassGenerator from 'Core/Generator/Interactor/Task/ContainerClassGenerator';
import CoreGeneratorInteractorTaskContainerObjectGenerator from 'Core/Generator/Interactor/Task/ContainerObjectGenerator';
import CoreGeneratorInteractorTaskImportGenerator from 'Core/Generator/Interactor/Task/ImportGenerator';
import CoreGeneratorInteractorTaskInterfacePropertyGenerator from 'Core/Generator/Interactor/Task/InterfacePropertyGenerator';
import CoreGeneratorInteractorTaskAdditionalResourcesExtractor from 'Core/Generator/Interactor/Task/AdditionalResourcesExtractor';
import CoreGeneratorInteractorInteractor from 'Core/Generator/Interactor/Interactor';
import ControllerPresenter from 'App/Controller/Presenter';
import CoreConfigurationLanguageConfigUseCaseLanguageConfigUseCase from 'Core/Configuration/LanguageConfigUseCase/LanguageConfigUseCase';
import CoreManualCodeUseCaseManualCodeUseCase from 'Core/ManualCodeUseCase/ManualCodeUseCase';
import CoreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase from 'Core/Generator/AdditionalCreationUseCase/AdditionalCreationUseCase';
import ControllerController from 'App/Controller/Controller';
import InfrastructureFileTypeScript from 'Infrastructure/File/TypeScript';
import InfrastructureConfigTypeScript from 'Infrastructure/Config/TypeScript';
import InfrastructureFileParserClassParser from 'Infrastructure/File/Parser/ClassParser';
import InfrastructureFileParserImportParser from 'Infrastructure/File/Parser/ImportParser';
import InfrastructureFileParserInterfaceParser from 'Infrastructure/File/Parser/InterfaceParser';
import InfrastructureFileParserRootDependencyParser from 'Infrastructure/File/Parser/RootDependencyParser';
import FileParser from 'Infrastructure/File/Parser/Parser';
import InterfaceExtractor from 'Infrastructure/File/Parser/InterfaceExtractor';
import PropertyExtractor from 'Infrastructure/File/Parser/PropertyExtractor';
import ClassConstructorExtractor from 'Infrastructure/File/Parser/ClassConstructorExtractor';
import FileLoader from 'Infrastructure/File/Task/FileLoader';
import ModulePathResolver from 'Infrastructure/File/Task/ModulePathResolver';
import ClassParser from 'Infrastructure/File/Parser/ClassParser';
import ImportParser from 'Infrastructure/File/Parser/ImportParser';
import InterfaceParser from 'Infrastructure/File/Parser/InterfaceParser';
import RootDependencyParser from 'Infrastructure/File/Parser/RootDependencyParser';
import ParseHelper from 'Infrastructure/ParseHelper';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import process from 'process';
interface ManualInjections {
    infrastructureFileTypeScriptDirname: typeof path.dirname;
    infrastructureFileTypeScriptParsers: Array<FileParser>;
    infrastructureFileTaskFileLoaderFileExistsSync: typeof fs.existsSync;
    infrastructureFileTaskModulePathResolverResolve: typeof path.resolve;
    infrastructureConfigTypeScriptResolve: typeof path.resolve;
    infrastructureConfigTypeScriptCwd: typeof process.cwd;
    infrastructureConfigTypeScriptReadFile: typeof fsPromises.readFile;
    infrastructureConfigTypeScriptFileExists: typeof fs.existsSync;
    infrastructureConfigParserResolve: typeof path.resolve;
    interfaceExtractor: InterfaceExtractor;
    propertyExtractor: PropertyExtractor;
    classConstructorExtractor: ClassConstructorExtractor;
    fileLoader: FileLoader;
    modulePathResolver: ModulePathResolver;
    classParser: ClassParser;
    importParser: ImportParser;
    interfaceParser: InterfaceParser;
    rootDependencyParser: RootDependencyParser;
    parseHelper: ParseHelper;
    path: typeof path;
    fs: typeof fs;
    fsPromises: typeof fsPromises;
    process: typeof process;
    coreManualCodeUseCaseManualCodeUseCaseArray: Array<string>;
    coreManualCodeUseCaseManualCodeUseCasePropertyNames: {
        [property: string]: string;
    };
    controllerPresenterWriteFile: typeof fsPromises.writeFile;
    controllerPresenterResolve: typeof path.resolve;
    coreGeneratorSanitizerTaskNameGlobalizerDirname: typeof path.dirname;
    coreGeneratorSanitizerTaskFallbackRequireNameCreatorDirname: typeof path.dirname;
    coreGeneratorSanitizerTaskNameGlobalizerNormalize: typeof path.normalize;
    coreGeneratorInteractorTaskImportGeneratorResolve: typeof path.resolve;
    coreGeneratorInteractorTaskImportGeneratorRelative: typeof path.relative;
    coreGeneratorInteractorTaskImportGeneratorNormalize: typeof path.normalize;
}
interface InterfaceInstances {
    coreFileFileClient: InfrastructureFileTypeScript;
    coreConfigurationConfigClient: InfrastructureConfigTypeScript;
}
interface AdditionalResources {
    infrastructureFileTypeScript: InfrastructureFileTypeScript;
    infrastructureConfigTypeScript: InfrastructureConfigTypeScript;
    infrastructureFileParserClassParser: InfrastructureFileParserClassParser;
    infrastructureFileParserImportParser: InfrastructureFileParserImportParser;
    infrastructureFileParserInterfaceParser: InfrastructureFileParserInterfaceParser;
    infrastructureFileParserRootDependencyParser: InfrastructureFileParserRootDependencyParser;
}
class Container {
    private manualInjections: ManualInjections = {
        path: path,
        fs: fs,
        fsPromises: fsPromises,
        process: process,
        interfaceExtractor: new InterfaceExtractor(),
        propertyExtractor: new PropertyExtractor(),
        classConstructorExtractor: new ClassConstructorExtractor(),
        fileLoader: new FileLoader(fs.existsSync),
        modulePathResolver: new ModulePathResolver(path.resolve),
        classParser: new ClassParser(),
        importParser: new ImportParser(),
        interfaceParser: new InterfaceParser(),
        rootDependencyParser: new RootDependencyParser(),
        parseHelper: new ParseHelper(),
        coreManualCodeUseCaseManualCodeUseCaseArray: [
            "ManualInjections",
            "InterfaceInstances",
            "AdditionalResources"
        ],
        coreManualCodeUseCaseManualCodeUseCasePropertyNames: {
            manualInjections: "ManualInjections",
            interfaceInstances: "InterfaceInstances"
        },
        controllerPresenterWriteFile: fsPromises.writeFile,
        controllerPresenterResolve: path.resolve,
        coreGeneratorSanitizerTaskNameGlobalizerDirname: path.dirname,
        coreGeneratorSanitizerTaskFallbackRequireNameCreatorDirname: path.dirname,
        coreGeneratorSanitizerTaskNameGlobalizerNormalize: path.normalize,
        coreGeneratorInteractorTaskImportGeneratorResolve: path.resolve,
        coreGeneratorInteractorTaskImportGeneratorRelative: path.relative,
        coreGeneratorInteractorTaskImportGeneratorNormalize: path.normalize,
        infrastructureConfigParserResolve: path.resolve,
        infrastructureConfigTypeScriptFileExists: fs.existsSync,
        infrastructureConfigTypeScriptReadFile: fsPromises.readFile,
        infrastructureConfigTypeScriptCwd: process.cwd,
        infrastructureConfigTypeScriptResolve: path.resolve,
        infrastructureFileTaskModulePathResolverResolve: path.resolve,
        infrastructureFileTaskFileLoaderFileExistsSync: fs.existsSync,
        infrastructureFileTypeScriptParsers: [
            this.infrastructureFileParserClassParser,
            this.infrastructureFileParserImportParser,
            this.infrastructureFileParserInterfaceParser,
            this.infrastructureFileParserRootDependencyParser
        ],
        infrastructureFileTypeScriptDirname: path.dirname
    };
    private interfaceInstances: InterfaceInstances = {
        coreFileFileClient: this.infrastructureFileTypeScript,
        coreConfigurationConfigClient: this.infrastructureConfigTypeScript
    };
    constructor() {
    }
    public get coreConfigurationConfigClient(): CoreConfigurationConfigClient {
        return this.interfaceInstances.coreConfigurationConfigClient;
    }
    public get coreFileFileClient(): CoreFileFileClient {
        return this.interfaceInstances.coreFileFileClient;
    }
    private _infrastructureFileParserRootDependencyParser?: InfrastructureFileParserRootDependencyParser;
    public get infrastructureFileParserRootDependencyParser(): InfrastructureFileParserRootDependencyParser {
        if (this._infrastructureFileParserRootDependencyParser)
            return this._infrastructureFileParserRootDependencyParser;
        else
            return this._infrastructureFileParserRootDependencyParser = new InfrastructureFileParserRootDependencyParser();
    }
    private _infrastructureFileParserInterfaceParser?: InfrastructureFileParserInterfaceParser;
    public get infrastructureFileParserInterfaceParser(): InfrastructureFileParserInterfaceParser {
        if (this._infrastructureFileParserInterfaceParser)
            return this._infrastructureFileParserInterfaceParser;
        else
            return this._infrastructureFileParserInterfaceParser = new InfrastructureFileParserInterfaceParser();
    }
    private _infrastructureFileParserImportParser?: InfrastructureFileParserImportParser;
    public get infrastructureFileParserImportParser(): InfrastructureFileParserImportParser {
        if (this._infrastructureFileParserImportParser)
            return this._infrastructureFileParserImportParser;
        else
            return this._infrastructureFileParserImportParser = new InfrastructureFileParserImportParser();
    }
    private _infrastructureFileParserClassParser?: InfrastructureFileParserClassParser;
    public get infrastructureFileParserClassParser(): InfrastructureFileParserClassParser {
        if (this._infrastructureFileParserClassParser)
            return this._infrastructureFileParserClassParser;
        else
            return this._infrastructureFileParserClassParser = new InfrastructureFileParserClassParser();
    }
    private _infrastructureParseHelper?: InfrastructureParseHelper;
    public get infrastructureParseHelper(): InfrastructureParseHelper {
        if (this._infrastructureParseHelper)
            return this._infrastructureParseHelper;
        else
            return this._infrastructureParseHelper = new InfrastructureParseHelper();
    }
    private _infrastructureConfigParser?: InfrastructureConfigParser;
    public get infrastructureConfigParser(): InfrastructureConfigParser {
        if (this._infrastructureConfigParser)
            return this._infrastructureConfigParser;
        else
            return this._infrastructureConfigParser = new InfrastructureConfigParser(this.infrastructureParseHelper, this.manualInjections.infrastructureConfigParserResolve);
    }
    private _infrastructureConfigTypeScript?: InfrastructureConfigTypeScript;
    public get infrastructureConfigTypeScript(): InfrastructureConfigTypeScript {
        if (this._infrastructureConfigTypeScript)
            return this._infrastructureConfigTypeScript;
        else
            return this._infrastructureConfigTypeScript = new InfrastructureConfigTypeScript(this.manualInjections.infrastructureConfigTypeScriptFileExists, this.manualInjections.infrastructureConfigTypeScriptReadFile, this.infrastructureConfigParser, this.manualInjections.infrastructureConfigTypeScriptCwd, this.manualInjections.infrastructureConfigTypeScriptResolve);
    }
    private _infrastructureFileTaskModulePathResolver?: InfrastructureFileTaskModulePathResolver;
    public get infrastructureFileTaskModulePathResolver(): InfrastructureFileTaskModulePathResolver {
        if (this._infrastructureFileTaskModulePathResolver)
            return this._infrastructureFileTaskModulePathResolver;
        else
            return this._infrastructureFileTaskModulePathResolver = new InfrastructureFileTaskModulePathResolver(this.manualInjections.infrastructureFileTaskModulePathResolverResolve);
    }
    private _infrastructureFileTaskFileLoader?: InfrastructureFileTaskFileLoader;
    public get infrastructureFileTaskFileLoader(): InfrastructureFileTaskFileLoader {
        if (this._infrastructureFileTaskFileLoader)
            return this._infrastructureFileTaskFileLoader;
        else
            return this._infrastructureFileTaskFileLoader = new InfrastructureFileTaskFileLoader(this.manualInjections.infrastructureFileTaskFileLoaderFileExistsSync);
    }
    private _infrastructureFileParserClassConstructorExtractor?: InfrastructureFileParserClassConstructorExtractor;
    public get infrastructureFileParserClassConstructorExtractor(): InfrastructureFileParserClassConstructorExtractor {
        if (this._infrastructureFileParserClassConstructorExtractor)
            return this._infrastructureFileParserClassConstructorExtractor;
        else
            return this._infrastructureFileParserClassConstructorExtractor = new InfrastructureFileParserClassConstructorExtractor();
    }
    private _infrastructureFileParserPropertyExtractor?: InfrastructureFileParserPropertyExtractor;
    public get infrastructureFileParserPropertyExtractor(): InfrastructureFileParserPropertyExtractor {
        if (this._infrastructureFileParserPropertyExtractor)
            return this._infrastructureFileParserPropertyExtractor;
        else
            return this._infrastructureFileParserPropertyExtractor = new InfrastructureFileParserPropertyExtractor();
    }
    private _infrastructureFileParserInterfaceExtractor?: InfrastructureFileParserInterfaceExtractor;
    public get infrastructureFileParserInterfaceExtractor(): InfrastructureFileParserInterfaceExtractor {
        if (this._infrastructureFileParserInterfaceExtractor)
            return this._infrastructureFileParserInterfaceExtractor;
        else
            return this._infrastructureFileParserInterfaceExtractor = new InfrastructureFileParserInterfaceExtractor();
    }
    private _infrastructureFileTypeScript?: InfrastructureFileTypeScript;
    public get infrastructureFileTypeScript(): InfrastructureFileTypeScript {
        if (this._infrastructureFileTypeScript)
            return this._infrastructureFileTypeScript;
        else
            return this._infrastructureFileTypeScript = new InfrastructureFileTypeScript(this.manualInjections.infrastructureFileTypeScriptParsers, this.manualInjections.infrastructureFileTypeScriptDirname, this.infrastructureFileParserInterfaceExtractor, this.infrastructureFileParserPropertyExtractor, this.infrastructureFileParserClassConstructorExtractor, this.infrastructureFileTaskFileLoader, this.infrastructureFileTaskModulePathResolver);
    }
    private _coreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase?: CoreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase;
    public get coreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase(): CoreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase {
        if (this._coreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase)
            return this._coreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase;
        else
            return this._coreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase = new CoreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase();
    }
    private _coreManualCodeUseCaseManualCodeUseCase?: CoreManualCodeUseCaseManualCodeUseCase;
    public get coreManualCodeUseCaseManualCodeUseCase(): CoreManualCodeUseCaseManualCodeUseCase {
        if (this._coreManualCodeUseCaseManualCodeUseCase)
            return this._coreManualCodeUseCaseManualCodeUseCase;
        else
            return this._coreManualCodeUseCaseManualCodeUseCase = new CoreManualCodeUseCaseManualCodeUseCase(this.coreFileFileClient, this.manualInjections.coreManualCodeUseCaseManualCodeUseCaseArray, this.manualInjections.coreManualCodeUseCaseManualCodeUseCasePropertyNames);
    }
    private _coreConfigurationLanguageConfigUseCaseLanguageConfigUseCase?: CoreConfigurationLanguageConfigUseCaseLanguageConfigUseCase;
    public get coreConfigurationLanguageConfigUseCaseLanguageConfigUseCase(): CoreConfigurationLanguageConfigUseCaseLanguageConfigUseCase {
        if (this._coreConfigurationLanguageConfigUseCaseLanguageConfigUseCase)
            return this._coreConfigurationLanguageConfigUseCaseLanguageConfigUseCase;
        else
            return this._coreConfigurationLanguageConfigUseCaseLanguageConfigUseCase = new CoreConfigurationLanguageConfigUseCaseLanguageConfigUseCase(this.coreConfigurationConfigClient);
    }
    private _controllerPresenter?: ControllerPresenter;
    public get controllerPresenter(): ControllerPresenter {
        if (this._controllerPresenter)
            return this._controllerPresenter;
        else
            return this._controllerPresenter = new ControllerPresenter(this.manualInjections.controllerPresenterWriteFile, this.manualInjections.controllerPresenterResolve);
    }
    private _coreGeneratorInteractorTaskAdditionalResourcesExtractor?: CoreGeneratorInteractorTaskAdditionalResourcesExtractor;
    public get coreGeneratorInteractorTaskAdditionalResourcesExtractor(): CoreGeneratorInteractorTaskAdditionalResourcesExtractor {
        if (this._coreGeneratorInteractorTaskAdditionalResourcesExtractor)
            return this._coreGeneratorInteractorTaskAdditionalResourcesExtractor;
        else
            return this._coreGeneratorInteractorTaskAdditionalResourcesExtractor = new CoreGeneratorInteractorTaskAdditionalResourcesExtractor(this.coreGeneratorInteractorTaskFileExtractor);
    }
    private _coreGeneratorInteractorTaskInterfacePropertyGenerator?: CoreGeneratorInteractorTaskInterfacePropertyGenerator;
    public get coreGeneratorInteractorTaskInterfacePropertyGenerator(): CoreGeneratorInteractorTaskInterfacePropertyGenerator {
        if (this._coreGeneratorInteractorTaskInterfacePropertyGenerator)
            return this._coreGeneratorInteractorTaskInterfacePropertyGenerator;
        else
            return this._coreGeneratorInteractorTaskInterfacePropertyGenerator = new CoreGeneratorInteractorTaskInterfacePropertyGenerator(this.coreStringHelper);
    }
    private _coreGeneratorSanitizerTaskFallbackRequireNameCreator?: CoreGeneratorSanitizerTaskFallbackRequireNameCreator;
    public get coreGeneratorSanitizerTaskFallbackRequireNameCreator(): CoreGeneratorSanitizerTaskFallbackRequireNameCreator {
        if (this._coreGeneratorSanitizerTaskFallbackRequireNameCreator)
            return this._coreGeneratorSanitizerTaskFallbackRequireNameCreator;
        else
            return this._coreGeneratorSanitizerTaskFallbackRequireNameCreator = new CoreGeneratorSanitizerTaskFallbackRequireNameCreator(this.manualInjections.coreGeneratorSanitizerTaskFallbackRequireNameCreatorDirname, this.coreStringHelper);
    }
    private _coreGeneratorSanitizerTaskNameGlobalizer?: CoreGeneratorSanitizerTaskNameGlobalizer;
    public get coreGeneratorSanitizerTaskNameGlobalizer(): CoreGeneratorSanitizerTaskNameGlobalizer {
        if (this._coreGeneratorSanitizerTaskNameGlobalizer)
            return this._coreGeneratorSanitizerTaskNameGlobalizer;
        else
            return this._coreGeneratorSanitizerTaskNameGlobalizer = new CoreGeneratorSanitizerTaskNameGlobalizer(this.manualInjections.coreGeneratorSanitizerTaskNameGlobalizerDirname, this.coreStringHelper, this.manualInjections.coreGeneratorSanitizerTaskNameGlobalizerNormalize);
    }
    private _coreGeneratorSanitizerTaskImportCleaner?: CoreGeneratorSanitizerTaskImportCleaner;
    public get coreGeneratorSanitizerTaskImportCleaner(): CoreGeneratorSanitizerTaskImportCleaner {
        if (this._coreGeneratorSanitizerTaskImportCleaner)
            return this._coreGeneratorSanitizerTaskImportCleaner;
        else
            return this._coreGeneratorSanitizerTaskImportCleaner = new CoreGeneratorSanitizerTaskImportCleaner();
    }
    private _coreGeneratorSanitizerTaskRequirementResolver?: CoreGeneratorSanitizerTaskRequirementResolver;
    public get coreGeneratorSanitizerTaskRequirementResolver(): CoreGeneratorSanitizerTaskRequirementResolver {
        if (this._coreGeneratorSanitizerTaskRequirementResolver)
            return this._coreGeneratorSanitizerTaskRequirementResolver;
        else
            return this._coreGeneratorSanitizerTaskRequirementResolver = new CoreGeneratorSanitizerTaskRequirementResolver();
    }
    private _coreGeneratorSanitizerTaskIgnoredFileRemover?: CoreGeneratorSanitizerTaskIgnoredFileRemover;
    public get coreGeneratorSanitizerTaskIgnoredFileRemover(): CoreGeneratorSanitizerTaskIgnoredFileRemover {
        if (this._coreGeneratorSanitizerTaskIgnoredFileRemover)
            return this._coreGeneratorSanitizerTaskIgnoredFileRemover;
        else
            return this._coreGeneratorSanitizerTaskIgnoredFileRemover = new CoreGeneratorSanitizerTaskIgnoredFileRemover();
    }
    private _coreGeneratorSanitizerTaskGlobalImportRemover?: CoreGeneratorSanitizerTaskGlobalImportRemover;
    public get coreGeneratorSanitizerTaskGlobalImportRemover(): CoreGeneratorSanitizerTaskGlobalImportRemover {
        if (this._coreGeneratorSanitizerTaskGlobalImportRemover)
            return this._coreGeneratorSanitizerTaskGlobalImportRemover;
        else
            return this._coreGeneratorSanitizerTaskGlobalImportRemover = new CoreGeneratorSanitizerTaskGlobalImportRemover();
    }
    private _coreGeneratorSanitizerSanitizerService?: CoreGeneratorSanitizerSanitizerService;
    public get coreGeneratorSanitizerSanitizerService(): CoreGeneratorSanitizerSanitizerService {
        if (this._coreGeneratorSanitizerSanitizerService)
            return this._coreGeneratorSanitizerSanitizerService;
        else
            return this._coreGeneratorSanitizerSanitizerService = new CoreGeneratorSanitizerSanitizerService(this.coreGeneratorSanitizerTaskGlobalImportRemover, this.coreFileFileClient, this.coreGeneratorSanitizerTaskIgnoredFileRemover, this.coreGeneratorSanitizerTaskRequirementResolver, this.coreGeneratorSanitizerTaskImportCleaner, this.coreGeneratorSanitizerTaskNameGlobalizer, this.coreGeneratorSanitizerTaskFallbackRequireNameCreator);
    }
    private _coreConfigurationConfigEntity?: CoreConfigurationConfigEntity;
    public get coreConfigurationConfigEntity(): CoreConfigurationConfigEntity {
        if (this._coreConfigurationConfigEntity)
            return this._coreConfigurationConfigEntity;
        else
            return this._coreConfigurationConfigEntity = new CoreConfigurationConfigEntity();
    }
    private _coreGeneratorInteractorTaskFileExtractor?: CoreGeneratorInteractorTaskFileExtractor;
    public get coreGeneratorInteractorTaskFileExtractor(): CoreGeneratorInteractorTaskFileExtractor {
        if (this._coreGeneratorInteractorTaskFileExtractor)
            return this._coreGeneratorInteractorTaskFileExtractor;
        else
            return this._coreGeneratorInteractorTaskFileExtractor = new CoreGeneratorInteractorTaskFileExtractor(this.coreFileFileClient, this.coreGeneratorSanitizerSanitizerService);
    }
    private _coreGeneratorInteractorTaskImportGenerator?: CoreGeneratorInteractorTaskImportGenerator;
    public get coreGeneratorInteractorTaskImportGenerator(): CoreGeneratorInteractorTaskImportGenerator {
        if (this._coreGeneratorInteractorTaskImportGenerator)
            return this._coreGeneratorInteractorTaskImportGenerator;
        else
            return this._coreGeneratorInteractorTaskImportGenerator = new CoreGeneratorInteractorTaskImportGenerator(this.manualInjections.coreGeneratorInteractorTaskImportGeneratorResolve, this.manualInjections.coreGeneratorInteractorTaskImportGeneratorRelative, this.manualInjections.coreGeneratorInteractorTaskImportGeneratorNormalize);
    }
    private _coreStringHelper?: CoreStringHelper;
    public get coreStringHelper(): CoreStringHelper {
        if (this._coreStringHelper)
            return this._coreStringHelper;
        else
            return this._coreStringHelper = new CoreStringHelper();
    }
    private _coreGeneratorInteractorTaskContainerObjectGenerator?: CoreGeneratorInteractorTaskContainerObjectGenerator;
    public get coreGeneratorInteractorTaskContainerObjectGenerator(): CoreGeneratorInteractorTaskContainerObjectGenerator {
        if (this._coreGeneratorInteractorTaskContainerObjectGenerator)
            return this._coreGeneratorInteractorTaskContainerObjectGenerator;
        else
            return this._coreGeneratorInteractorTaskContainerObjectGenerator = new CoreGeneratorInteractorTaskContainerObjectGenerator(this.coreStringHelper);
    }
    private _coreGeneratorInteractorTaskContainerClassGenerator?: CoreGeneratorInteractorTaskContainerClassGenerator;
    public get coreGeneratorInteractorTaskContainerClassGenerator(): CoreGeneratorInteractorTaskContainerClassGenerator {
        if (this._coreGeneratorInteractorTaskContainerClassGenerator)
            return this._coreGeneratorInteractorTaskContainerClassGenerator;
        else
            return this._coreGeneratorInteractorTaskContainerClassGenerator = new CoreGeneratorInteractorTaskContainerClassGenerator();
    }
    private _coreGeneratorInteractorInteractor?: CoreGeneratorInteractorInteractor;
    public get coreGeneratorInteractorInteractor(): CoreGeneratorInteractorInteractor {
        if (this._coreGeneratorInteractorInteractor)
            return this._coreGeneratorInteractorInteractor;
        else
            return this._coreGeneratorInteractorInteractor = new CoreGeneratorInteractorInteractor(this.coreGeneratorInteractorTaskContainerClassGenerator, this.coreGeneratorInteractorTaskContainerObjectGenerator, this.coreGeneratorInteractorTaskImportGenerator, this.coreGeneratorInteractorTaskFileExtractor, this.coreGeneratorInteractorTaskInterfacePropertyGenerator, this.coreGeneratorInteractorTaskAdditionalResourcesExtractor);
    }
    private _controllerController?: ControllerController;
    public get controllerController(): ControllerController {
        if (this._controllerController)
            return this._controllerController;
        else
            return this._controllerController = new ControllerController(this.coreGeneratorInteractorInteractor, this.controllerPresenter, this.coreConfigurationLanguageConfigUseCaseLanguageConfigUseCase, this.coreManualCodeUseCaseManualCodeUseCase, this.coreGeneratorAdditionalCreationUseCaseAdditionalCreationUseCase);
    }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
