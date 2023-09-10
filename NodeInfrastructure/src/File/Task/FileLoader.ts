import {FileError} from 'Core/File/FileClient';
import ts, {Program, SourceFile} from 'typescript';
import CatchHelper from 'Core/CatchHelper';
import fs from 'fs';
import NotLoadable from 'Infrastructure/File/NotLoadable';

export default class FileLoader {
    constructor(
        private fileExistsSync: typeof fs.existsSync
    ) {
    }

    public loadFile(modulePath: string): throwErrorOrReturn<FileError, ts.SourceFile> {
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

    private tryLoadFile(modulePath: string, suffix: string): SourceFile | undefined {
        const filePath: string = modulePath + suffix;
        if (this.fileExistsSync(filePath) == false) throw new NotLoadable();
        const program: Program = ts.createProgram([filePath], {allowJs: true});
        const sourceFile: SourceFile | undefined = program.getSourceFile(filePath);

        if (sourceFile === undefined) throw new NotLoadable();

        return sourceFile;
    }
}