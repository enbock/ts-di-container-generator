// @formatter:off
import CoreFileFileClient from 'Core/File/FileClient';
import CoreConfigurationConfigClient from 'Core/Configuration/ConfigClient';
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
import CoreGeneratorInteractorTaskFileExtractor from 'Core/Generator/Interactor/Task/FileExtractor';
import CoreGeneratorInteractorTaskInterfacePropertyGenerator from 'Core/Generator/Interactor/Task/InterfacePropertyGenerator';
import CoreGeneratorInteractorInteractor from 'Core/Generator/Interactor/Interactor';
import ControllerPresenter from 'App/Controller/Presenter';
import CoreConfigurationLanguageConfigUseCaseLanguageConfigUseCase from 'Core/Configuration/LanguageConfigUseCase/LanguageConfigUseCase';
import CoreManualCodeUseCaseManualCodeUseCase from 'Core/ManualCodeUseCase/ManualCodeUseCase';
import ControllerController from 'App/Controller/Controller';
import InterfaceExtractor from 'Infrastructure/File/Parser/InterfaceExtractor';
import PropertyExtractor from 'Infrastructure/File/Parser/PropertyExtractor';
import ClassConstructorExtractor from 'Infrastructure/File/Parser/ClassConstructorExtractor';
import FileLoader from 'Infrastructure/File/Task/FileLoader';
import ModulePathResolver from 'Infrastructure/File/Task/ModulePathResolver';
import ClassParser from 'Infrastructure/File/Parser/ClassParser';
import ImportParser from 'Infrastructure/File/Parser/ImportParser';
import InterfaceParser from 'Infrastructure/File/Parser/InterfaceParser';
import RootDependencyParser from 'Infrastructure/File/Parser/RootDependencyParser';
import ConfigParser from 'Infrastructure/Config/Parser';
import ParseHelper from 'Infrastructure/ParseHelper';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import process from 'process';
import CoreFileFileClientTypeScript from 'Infrastructure/File/TypeScript';
import MyTypeScript from 'Infrastructure/File/TypeScript';
import CoreConfigurationConfigClientTypeScript from 'Infrastructure/Config/TypeScript';
interface ManualInjections {
    test: Array<MyTypeScript>;
    interfaceExtractor: InterfaceExtractor;
    propertyExtractor: PropertyExtractor;
    classConstructorExtractor: ClassConstructorExtractor;
    fileLoader: FileLoader;
    modulePathResolver: ModulePathResolver;
    classParser: ClassParser;
    importParser: ImportParser;
    interfaceParser: InterfaceParser;
    rootDependencyParser: RootDependencyParser;
    configParser: ConfigParser;
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
    coreFileFileClient: CoreFileFileClientTypeScript;
    coreConfigurationConfigClient: CoreConfigurationConfigClientTypeScript;
}
interface AdditionalResources {
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
        configParser: undefined!,
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
        coreGeneratorInteractorTaskImportGeneratorNormalize: path.normalize
    };
    private interfaceInstances: InterfaceInstances & AdditionalResources = {
        coreFileFileClient: undefined!,
        coreConfigurationConfigClient: undefined!
    };
    constructor() {
        this.manualInjections.configParser = new ConfigParser(this.manualInjections.parseHelper, path.resolve);
        this.interfaceInstances.coreFileFileClient = new CoreFileFileClientTypeScript([
            this.manualInjections.classParser,
            this.manualInjections.importParser,
            this.manualInjections.interfaceParser,
            this.manualInjections.rootDependencyParser
        ], path.dirname, this.manualInjections.interfaceExtractor, this.manualInjections.propertyExtractor, this.manualInjections.classConstructorExtractor, this.manualInjections.fileLoader, this.manualInjections.modulePathResolver);
        this.interfaceInstances.coreConfigurationConfigClient = new CoreConfigurationConfigClientTypeScript(fs.existsSync, fsPromises.readFile, this.manualInjections.configParser, process.cwd, path.resolve);
    }
    public get coreConfigurationConfigClient(): CoreConfigurationConfigClient {
        return this.interfaceInstances.coreConfigurationConfigClient;
    }
    public get coreFileFileClient(): CoreFileFileClient {
        return this.interfaceInstances.coreFileFileClient;
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
            return this._coreGeneratorInteractorInteractor = new CoreGeneratorInteractorInteractor(this.coreGeneratorInteractorTaskContainerClassGenerator, this.coreGeneratorInteractorTaskContainerObjectGenerator, this.coreGeneratorInteractorTaskImportGenerator, this.coreGeneratorInteractorTaskFileExtractor, this.coreGeneratorInteractorTaskInterfacePropertyGenerator);
    }
    private _controllerController?: ControllerController;
    public get controllerController(): ControllerController {
        if (this._controllerController)
            return this._controllerController;
        else
            return this._controllerController = new ControllerController(this.coreGeneratorInteractorInteractor, this.controllerPresenter, this.coreConfigurationLanguageConfigUseCaseLanguageConfigUseCase, this.coreManualCodeUseCaseManualCodeUseCase);
    }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
