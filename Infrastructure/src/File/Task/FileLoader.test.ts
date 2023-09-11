import FileLoader from './FileLoader';
import fs from 'fs';
import {FileError} from 'Core/File/FileClient';
import ts from 'typescript';

describe('FileLoader', function (): void {
    let task: FileLoader,
        fileExistsSync: jasmine.Spy<typeof fs.existsSync>
    ;

    beforeAll(function (): void {
        let fd: number = fs.openSync('./TestFile.ts', 'w', 0o777);
        fs.writeSync(fd, 'class TestFile{}');
        fs.closeSync(fd);
    });

    afterAll(function (): void {
        fs.unlinkSync('./TestFile.ts');
    });

    beforeEach(function (): void {
        fileExistsSync = jasmine.createSpy<typeof fs.existsSync>();
        task = new FileLoader(
            fileExistsSync
        );
    });

    it('should throw error when module file does not exist', function (): void {
        fileExistsSync.and.returnValue(false);

        expect(function (): void {
            task.loadFile('test::modulePath');
        }).toThrowError(FileError);

        expect(fileExistsSync).toHaveBeenCalledWith('test::modulePath.ts');
    });

    it('should throw error when .ts file does not exist and .tsx does not exist', function (): void {
        fileExistsSync.and.returnValues(false, false);

        expect(function (): void {
            task.loadFile('test::modulePath');
        }).toThrowError(FileError);

        expect(fileExistsSync).toHaveBeenCalledWith('test::modulePath.ts');
        expect(fileExistsSync).toHaveBeenCalledWith('test::modulePath.tsx');
    });

    it('should load .ts file when exists', function (): void {
        fileExistsSync.and.returnValue(true);

        const result: ts.SourceFile = task.loadFile('./TestFile');

        expect(result).toBeDefined();
    });
});