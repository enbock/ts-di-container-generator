import ts, {Node, Program, SourceFile} from 'typescript';
import path from 'path';
import FileName from 'Core/src/File/FileName';
import DescriptorEntity from 'Core/src/DescriptorEntity';
import Parser from 'Infrastructure/File/Parser/Parser';
import FileClient, {FileError} from 'Core/File/FileClient';
import fs from 'fs';

export default class TypeScript implements FileClient {
    constructor(
        private parsers: Parser[],
        private resolve: typeof path.resolve,
        private dirname: typeof path.dirname,
        private fileExistsSync: typeof fs.existsSync
    ) {
    }

    public extract(basePath: string, file: FileName): DescriptorEntity {
        const filePath: string = this.resolve(basePath, file);
        if (this.fileExistsSync(filePath) == false) throw new FileError();

        console.log('Parse', filePath, '...');
        const result: DescriptorEntity = new DescriptorEntity(filePath);
        const program: Program = ts.createProgram([filePath], {allowJs: true});
        const sourceFile: SourceFile | undefined = program.getSourceFile(filePath + '.ts');

        if (sourceFile === undefined) return result;

        ts.forEachChild(sourceFile, (node: Node): void => {
            this.parsers.forEach((task: Parser) => task.parse(node, result));
        });

        return result;
    }

    public makeImportPathsAbsolute(descriptor: DescriptorEntity): void {
        const dirname: string = this.dirname(descriptor.file);
        for (const i of descriptor.imports) {
            i.file = this.resolve(dirname, i.file);
        }
    }
}
