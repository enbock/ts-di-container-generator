import ts, {Node, Program, SourceFile} from 'typescript';
import path from 'path';
import FileName from 'Core/File/FileName';
import DescriptorEntity from 'Core/DescriptorEntity';
import Parser from 'Infrastructure/File/Parser/Parser';
import FileClient, {FileError} from 'Core/File/FileClient';
import CatchHelper from 'Core/CatchHelper';
import fs from 'fs';
import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';

class NotLoadable extends Error {
}

export default class TypeScript implements FileClient {
    constructor(
        private parsers: Parser[],
        private resolve: typeof path.resolve,
        private dirname: typeof path.dirname,
        private fileExistsSync: typeof fs.existsSync
    ) {
    }

    public extract(basePath: string, file: FileName, config: ConfigEntity): DescriptorEntity {
        let modulePath: string = this.resolveModulePath(basePath, file, config);
        let sourceFile: SourceFile | undefined;

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

        const result: DescriptorEntity = new DescriptorEntity(modulePath);
        ts.forEachChild(sourceFile, (node: Node): void => {
            this.parsers.forEach((task: Parser) => task.parse(node, result));
        });

        return result;
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

    public makeImportPathsAbsolute(descriptor: DescriptorEntity, config: ConfigEntity): void {
        const dirname: string = this.dirname(descriptor.file);
        for (const i of descriptor.imports) {
            i.file = this.resolveModulePath(dirname, i.file, config);
        }
    }
}
