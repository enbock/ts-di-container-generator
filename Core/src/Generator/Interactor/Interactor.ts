import StringHelper from 'Core/StringHelper';
import ContainerClassGenerator from 'Core/Generator/Interactor/Task/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/Interactor/Task/ContainerObjectGenerator';
import ImportGenerator from 'Core/Generator/Interactor/Task/ImportGenerator';
import ts, {ClassElement} from 'typescript';
import GenerateRequest from 'Core/Generator/Interactor/GenerateRequest';
import GenerateResponse from 'Core/Generator/Interactor/GenerateResponse';
import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';
import FileExtractor from 'Core/Generator/Interactor/Task/FileExtractor';
import FailedDescriptorEntity from 'Core/Generator/Interactor/FailedDescriptorEntity';

export default class Interactor {
    constructor(
        private stringHelper: StringHelper,
        private statementGenerator: ContainerClassGenerator,
        private objectGenerator: ContainerObjectGenerator,
        private importGenerator: ImportGenerator,
        private fileExtractor: FileExtractor
    ) {
    }

    public loadAndGenerate(request: GenerateRequest, response: GenerateResponse): void {
        const failedDescriptors: Array<FailedDescriptorEntity> = [];
        const descriptors: Array<DescriptorEntity> = this.fileExtractor.extract(
            request.basePath,
            request.mainFile,
            request.ignoreList,
            failedDescriptors
        );

        console.log('Failed:', failedDescriptors);
        console.log('Loaded:', descriptors.join('\n'));

        response.statements = this.generateStructure(request.basePath, request.mainFile, descriptors);
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