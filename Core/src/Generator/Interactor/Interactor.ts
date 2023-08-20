import ContainerClassGenerator from 'Core/Generator/Interactor/Task/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/Interactor/Task/ContainerObjectGenerator';
import ImportGenerator from 'Core/Generator/Interactor/Task/ImportGenerator';
import ts, {ClassElement} from 'typescript';
import GenerateRequest from 'Core/Generator/Interactor/GenerateRequest';
import GenerateResponse from 'Core/Generator/Interactor/GenerateResponse';
import FileName from 'Core/File/FileName';
import DescriptorEntity, {ClassEntity, ImportEntity, InterfaceEntity, Type} from 'Core/DescriptorEntity';
import FileExtractor, {ParameterBag} from 'Core/Generator/Interactor/Task/FileExtractor';
import FailedDescriptorEntity from 'Core/Generator/Interactor/FailedDescriptorEntity';

export default class Interactor {
    constructor(
        private statementGenerator: ContainerClassGenerator,
        private objectGenerator: ContainerObjectGenerator,
        private importGenerator: ImportGenerator,
        private fileExtractor: FileExtractor
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
        this.removeUnusedClasses(descriptors);

        console.log('Failed:', failedDescriptors);
        console.log('Loaded:', descriptors.join('\n'));

        response.statements = this.generateStructure(request.basePath, request.mainFile, descriptors);
    }

    private removeUnusedClasses(descriptors: Array<DescriptorEntity>): void {
        const allImports: Array<ImportEntity> = descriptors
            .map((d: DescriptorEntity): Array<ImportEntity> => d.imports)
            .flat()
        ;
        descriptors.forEach(
            (d: DescriptorEntity): void => {
                d.provides = d.provides.filter(
                    (p: InterfaceEntity | ClassEntity): boolean => {
                        const result: boolean = p.type == Type.INTERFACE
                            || allImports.find(
                                (i: ImportEntity): boolean => i.alias.name == p.name
                            ) !== undefined;
                        if (!result) console.log('Removed::', p);
                        return result;
                    }
                );
            }
        );
    }

    private generateStructure(
        basePath: string,
        targetFile: FileName,
        descriptors: Array<DescriptorEntity>
    ): Array<ts.Statement> {
        const members: ClassElement[] = this.objectGenerator.generate(descriptors);
        return [
            ...this.importGenerator.generate(descriptors, basePath, targetFile),
            ...this.statementGenerator.generate(members)
        ];
    }
}