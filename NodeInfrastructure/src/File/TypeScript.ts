import ts, {Node, Program, SourceFile} from 'typescript';
import path from 'path';
import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';
import Parser from 'Infrastructure/File/Parser/Parser';
import FileClient, {FileError} from 'Core/File/FileClient';
import CatchHelper from 'Core/CatchHelper';
import fs from 'fs';
import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';
import InterfaceNodeEntity from 'Core/File/InterfaceNodeEntity';
import NamedInterfaceParser from 'Infrastructure/File/Parser/NamedInterfaceParser';

class NotLoadable extends Error {
}

export default class TypeScript implements FileClient {
    constructor(
        private parsers: Parser[],
        private resolve: typeof path.resolve,
        private dirname: typeof path.dirname,
        private fileExistsSync: typeof fs.existsSync,
        private namedInterfaceParser: NamedInterfaceParser
    ) {
    }

    public extract(
        basePath: string,
        file: FileName,
        config: ConfigEntity
    ): throwErrorOrReturn<FileError, DescriptorEntity> {
        let modulePath: string = this.resolveModulePath(basePath, file, config);
        let sourceFile: SourceFile = this.loadFile(modulePath);

        const result: DescriptorEntity = new DescriptorEntity(modulePath);
        ts.forEachChild(sourceFile, (node: Node): void => {
            this.parsers.forEach((task: Parser) => task.parse(node, result));
        });

        return result;
    }

    public makeImportPathsAbsolute(descriptor: DescriptorEntity, config: ConfigEntity): void {
        const dirname: string = this.dirname(descriptor.file);
        for (const i of descriptor.imports) {
            i.file = this.resolveModulePath(dirname, i.file, config);
        }
    }

    public extractInterface(basePath: string, containerFile: FileName, interfaceName: string): InterfaceNodeEntity {
        let modulePath: string = this.resolveModulePath(basePath, containerFile, new ConfigEntity());
        const result: InterfaceNodeEntity = new InterfaceNodeEntity(interfaceName);
        result.node = ts.factory.createInterfaceDeclaration(
            undefined,
            interfaceName,
            undefined,
            undefined,
            []
        );
        try {
            let sourceFile: SourceFile = this.loadFile(modulePath);
            const descriptor: DescriptorEntity = new DescriptorEntity('');
            ts.forEachChild(sourceFile, (node: Node): void => {
                this.parsers.forEach((task: Parser) => task.parse(node, descriptor));
            });
            ts.forEachChild(sourceFile, (node: Node): void => {
                this.namedInterfaceParser.parse(node, result, interfaceName, descriptor.imports);
            });
        } catch (error) {
            CatchHelper.assert(error, FileError);
        }

        return result;
    }

    private loadFile(modulePath: string): throwErrorOrReturn<FileError, ts.SourceFile> {
        let sourceFile: ts.SourceFile | undefined;
        try {
            sourceFile = this.tryLoadFile(modulePath, '.ts');
        } catch (error) {
            CatchHelper.assert(error, NotLoadable);
            try {
                sourceFile = this.tryLoadFile(modulePath, '.tsx');
            } catch (error) {
                CatchHelper.assert(error, NotLoadable);
                throw new FileError();
            }
        }
        if (sourceFile === undefined) throw new FileError();
        return sourceFile;
    }

    private resolveModulePath(basePath: string, file: string, config: ConfigEntity): string {
        const globalPathAlias: PathAlias | undefined = config.pathAliases.find(pa => pa.regExp.test(file));
        if (globalPathAlias === undefined) return this.resolve(basePath, file);
        return this.resolve(config.basePath, file.replace(globalPathAlias.regExp, globalPathAlias.targetPath));
    }

    private tryLoadFile(modulePath: string, suffix: string): SourceFile | undefined {
        const filePath: string = modulePath + suffix;
        if (this.fileExistsSync(filePath) == false) throw new NotLoadable();
        const program: Program = ts.createProgram([filePath], {allowJs: true});
        const sourceFile: SourceFile | undefined = program.getSourceFile(filePath);

        if (sourceFile === undefined) throw new NotLoadable();

        return sourceFile;
    }
}
