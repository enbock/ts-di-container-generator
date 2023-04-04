import InjectionExtractor from './InjectionExtractor';
import ParsingTask from './Task/ParsingTask';
import fs from 'fs';
import {Node} from 'typescript';
import MockedObject from 'Core/MockedObject';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import ClassParser from './Task/ClassParser';
import DescriptorEntity from 'Core/DescriptorEntity';
import path from 'path';

describe('InjectionExtractor', function (): void {
    let injectionExtractor: InjectionExtractor,
        parserTask: Spy<ParsingTask>,
        resolve: jasmine.Spy<typeof path.resolve>
    ;

    beforeAll(function (): void {
        resolve = jasmine.createSpy<typeof path.resolve>();
        const fd: number = fs.openSync('./TestFile.ts', 'w', 0o777);
        fs.writeSync(fd, 'class TestFile{}');
        fs.closeSync(fd);
    });

    afterAll(function (): void {
        fs.unlinkSync('./TestFile.ts');
    });

    beforeEach(function (): void {
        parserTask = createSpyFromClass(ClassParser);
        injectionExtractor = new InjectionExtractor(
            [parserTask],
            resolve
        );
    });

    it('should parse a file', async function (): Promise<void> {
        resolve.and.returnValue('./TestFile');
        parserTask.parse.and.callFake(function (node: Node, result: DescriptorEntity): void {
            result.provides = 'test::taskResult:' as MockedObject;
        });

        const result: DescriptorEntity = injectionExtractor.extract('test::dirname:', 'test::file:');

        expect(resolve).toHaveBeenCalledWith('test::dirname:', 'test::file:');
        expect(result.file).toBe('./TestFile');
        expect(result.provides).toBe('test::taskResult:' as MockedObject);
    });
});
