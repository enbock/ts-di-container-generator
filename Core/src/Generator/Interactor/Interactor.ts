import StringHelper from 'Core/StringHelper';
import ContainerClassGenerator from 'Core/Generator/ContainerClassGenerator';
import ContainerObjectGenerator from 'Core/Generator/ContainerObjectGenerator';
import ImportGenerator from 'Core/Generator/ImportGenerator';
import {ClassElement} from 'typescript';
import GenerateRequest from 'Core/Generator/Interactor/GenerateRequest';
import GenerateResponse from 'Core/Generator/Interactor/GenerateResponse';

export default class Interactor {
    constructor(
        private stringHelper: StringHelper,
        private statementGenerator: ContainerClassGenerator,
        private objectGenerator: ContainerObjectGenerator,
        private importGenerator: ImportGenerator
    ) {
    }

    public generate(request: GenerateRequest, response: GenerateResponse): void {
        const members: ClassElement[] = this.objectGenerator.generate(request.descriptors);
        response.statements = [
            ...this.importGenerator.generate(request.descriptors, request.basePath, request.targetFile),
            ...this.statementGenerator.generate(members)
        ];
    }
}