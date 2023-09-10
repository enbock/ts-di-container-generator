import ContainerClassGenerator from 'Core/Generator/Interactor/Task/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/Interactor/Task/ContainerObjectGenerator';
import ImportGenerator from 'Core/Generator/Interactor/Task/ImportGenerator';
import ts, {ClassElement, NodeArray, Statement} from 'typescript';
import GenerateRequest from 'Core/Generator/Interactor/GenerateRequest';
import GenerateResponse from 'Core/Generator/Interactor/GenerateResponse';
import DescriptorEntity, {
    ClassEntity,
    ImportEntity,
    InterfaceEntity,
    RequirementEntity,
    Type
} from 'Core/DescriptorEntity';
import FileExtractor, {ParameterBag} from 'Core/Generator/Interactor/Task/FileExtractor';
import FailedDescriptorEntity from 'Core/Generator/Interactor/FailedDescriptorEntity';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import InterfacePropertyGenerator from 'Core/Generator/Interactor/Task/InterfacePropertyGenerator';

interface StructureResult {
    imports: Array<ts.Statement>;
    members: NodeArray<Statement>;
}

export default class Interactor {
    constructor(
        private containerClassGenerator: ContainerClassGenerator,
        private objectGenerator: ContainerObjectGenerator,
        private importGenerator: ImportGenerator,
        private fileExtractor: FileExtractor,
        private interfacePropertyGenerator: InterfacePropertyGenerator
    ) {
    }

    public loadAndGenerate(request: GenerateRequest, response: GenerateResponse): void {
        const failedDescriptors: Array<FailedDescriptorEntity> = [];
        let descriptors: Array<DescriptorEntity> = [];
        this.fileExtractor.extract(
            request.mainFile,
            new ParameterBag(
                request.basePath,
                request.ignoreList,
                failedDescriptors,
                descriptors,
                request.config
            )
        );
        const allImports: Array<ImportEntity> = this.getAllImports(descriptors);
        this.sanitizeDefaultImportAliases(descriptors, allImports);
        this.removeUnusedClasses(descriptors, allImports);

        console.log('Failed:', failedDescriptors.length);
        console.log('Loaded:', descriptors.length);

        const data: StructureResult = this.generateStructure(
            request.basePath,
            descriptors,
            request.config,
            request.additionalContainerMembers
        );
        response.imports = [
            ...data.imports,
            ...this.importGenerator.generateImportList(
                descriptors,
                request.additionalImports,
                request.basePath,
                request.config,
                true
            )
        ];
        response.statements = data.members as unknown as Array<Statement>;
    }

    private sanitizeDefaultImportAliases(descriptors: Array<DescriptorEntity>, allImports: Array<ImportEntity>): void {
        descriptors.forEach(
            d => {
                const defaultImports = allImports.filter(x => d.file == x.file && x.alias.isDefault == true);
                const defaultClass: ClassEntity | undefined = d.provides.find(
                    x => x instanceof ClassEntity && x.isDefault == true
                ) as ClassEntity | undefined;
                if (defaultClass === undefined) return;

                const allRequirements = this.getAllRequirements(descriptors);
                defaultImports.map(di => {
                    di.alias.name = defaultClass.name;
                    allRequirements.filter(x => x.import === di).filter(y => {
                        y.parameter = defaultClass.name[0].toLocaleLowerCase() + defaultClass.name.substring(1);
                    });
                });
            }
        );
    }

    private removeUnusedClasses(descriptors: Array<DescriptorEntity>, allImports: Array<ImportEntity>): void {
        descriptors.forEach(
            (d: DescriptorEntity): void => {
                d.provides = d.provides.filter(
                    (p: InterfaceEntity | ClassEntity): boolean => {
                        if (p.type == Type.INTERFACE) return true;

                        const findByClassName = allImports.find(
                            (i: ImportEntity): boolean => i.alias.name == p.name || i.alias.origin == p.name
                        ) !== undefined;
                        if (findByClassName) return true;

                        console.log('Removed::', p);
                        return false;
                    }
                );
            }
        );
    }

    private getAllImports(descriptors: Array<DescriptorEntity>): Array<ImportEntity> {
        return descriptors
            .map((d: DescriptorEntity): Array<ImportEntity> => d.imports)
            .flat();
    }

    private getAllRequirements(descriptors: Array<DescriptorEntity>): Array<RequirementEntity> {
        return descriptors
            .map((d: DescriptorEntity): Array<RequirementEntity> => [...d.requires.values()].flat())
            .flat();
    }

    private generateStructure(
        basePath: string,
        descriptors: Array<DescriptorEntity>,
        config: ConfigEntity,
        manualMembers: Array<ClassElement>
    ): StructureResult {
        const members: Array<ClassElement> = [
            ...manualMembers,
            ...this.interfacePropertyGenerator.generate(descriptors),
            ...this.objectGenerator.generate(descriptors)
        ];
        return {
            imports: this.importGenerator.generate(descriptors, basePath, config, false),
            members: this.containerClassGenerator.generate(members)
        };
    }
}