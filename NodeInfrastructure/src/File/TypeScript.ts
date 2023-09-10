import ts, {Node, SourceFile} from 'typescript';
import path from 'path';
import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';
import Parser from 'Infrastructure/File/Parser/Parser';
import FileClient, {FileError} from 'Core/File/FileClient';
import CatchHelper from 'Core/CatchHelper';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import NodeEntity from 'Core/File/NodeEntity';
import InterfaceExtractor from 'Infrastructure/File/Parser/InterfaceExtractor';
import PropertyExtractor from 'Infrastructure/File/Parser/PropertyExtractor';
import ClassConstructorExtractor from 'Infrastructure/File/Parser/ClassConstructorExtractor';
import FileLoader from 'Infrastructure/File/Task/FileLoader';
import ModulePathResolver from 'Infrastructure/File/Task/ModulePathResolver';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';

export default class TypeScript implements FileClient {
    constructor(
        private parsers: Parser[],
        private dirname: typeof path.dirname,
        private interfaceExtractor: InterfaceExtractor,
        private propertyExtractor: PropertyExtractor,
        private classConstructorExtractor: ClassConstructorExtractor,
        private fileLoader: FileLoader,
        private modulePathResolver: ModulePathResolver
    ) {
    }

    public extract(
        basePath: string,
        file: FileName,
        config: ConfigEntity
    ): throwErrorOrReturn<FileError, DescriptorEntity> {
        let modulePath: string = this.modulePathResolver.resolvePath(basePath, file, config);
        const result: DescriptorEntity = new DescriptorEntity(modulePath);
        let sourceFile: SourceFile;
        try {
            sourceFile = this.fileLoader.loadFile(modulePath);
        } catch (error) {
            CatchHelper.assert(error, FileError);
            return result;
        }

        ts.forEachChild(sourceFile, (node: Node): void => {
            this.parsers.forEach((task: Parser) => task.parse(node, result));
        });

        return result;
    }

    public makeImportPathsAbsolute(descriptor: DescriptorEntity, config: ConfigEntity): void {
        const dirname: string = this.dirname(descriptor.file);
        for (const i of descriptor.imports) {
            i.file = this.modulePathResolver.resolvePath(dirname, i.file, config);
        }
    }

    public extractInterface(basePath: string, containerFile: FileName, interfaceName: string): NodeEntity {
        let modulePath: string = this.modulePathResolver.resolvePath(basePath, containerFile, new ConfigEntity());
        const result: NodeEntity = new NodeEntity(interfaceName);
        result.node = ts.factory.createInterfaceDeclaration(
            undefined,
            interfaceName,
            undefined,
            undefined,
            []
        );

        try {
            let sourceFile: SourceFile = this.fileLoader.loadFile(modulePath);
            const descriptor: DescriptorEntity = new DescriptorEntity('');
            ts.forEachChild(sourceFile, (node: Node): void => {
                this.parsers.forEach((task: Parser) => task.parse(node, descriptor));
            });
            ts.forEachChild(sourceFile, (node: Node): void => {
                this.interfaceExtractor.parse(node, result, interfaceName, descriptor.imports);
            });
        } catch (error) {
            CatchHelper.assert(error, FileError);
        }

        return result;
    }

    public extractContainerConstructor(basePath: string, containerFile: FileName): NodeEntity {
        let modulePath: string = this.modulePathResolver.resolvePath(basePath, containerFile, new ConfigEntity());
        const result: NodeEntity = new NodeEntity('constructor');
        result.node = ts.factory.createConstructorDeclaration(
            undefined,
            [],
            ts.factory.createBlock([], true)
        );
        try {
            let sourceFile: SourceFile = this.fileLoader.loadFile(modulePath);
            ts.forEachChild(sourceFile, (node: Node): void => {
                this.classConstructorExtractor.parse(node, result, 'Container');
            });
        } catch (error) {
            CatchHelper.assert(error, FileError);
        }

        return result;
    }

    public extractContainerProperty(
        basePath: string,
        containerFile: FileName,
        propertyName: string,
        typeName: string,
        data: ManualCodeEntity
    ): void {
        let modulePath: string = this.modulePathResolver.resolvePath(basePath, containerFile, new ConfigEntity());
        let sourceFile: SourceFile;

        try {
            sourceFile = this.fileLoader.loadFile(modulePath);
        } catch (error) {
            CatchHelper.assert(error, FileError);
            sourceFile = ts.createSourceFile(modulePath, 'class Container {}', 99);
        }

        ts.forEachChild(sourceFile, (node: Node): void => {
            this.propertyExtractor.parse(node, propertyName, typeName, 'Container', data);
        });
    }
}
