import TypeScript from './TypeScript';
import {Spy} from 'jasmine-auto-spies';
import mock from 'Core/mock';
import Parser from 'Infrastructure/Config/Parser';
import {ConfigMissing} from 'Core/Configuration/ConfigClient';
import MockedObject from 'Core/MockedObject';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import createSpy = jasmine.createSpy;

describe('TypeScript', function (): void {
    let client: TypeScript,
        fileExists: jasmine.Spy,
        readFile: jasmine.Spy,
        parser: Spy<Parser>,
        cwd: jasmine.Spy,
        resolve: jasmine.Spy
    ;

    beforeEach(function (): void {
        fileExists = createSpy();
        readFile = createSpy();
        parser = mock<Parser>();
        cwd = createSpy();
        resolve = createSpy();

        client = new TypeScript(
            fileExists,
            readFile,
            parser,
            cwd,
            resolve
        );
    });

    it('should throw error when file does not exist', async function (): Promise<void> {
        cwd.and.returnValue('test::currentPath');
        resolve.and.returnValue('test::resolvedPath');
        fileExists.and.returnValue(false);

        await expectAsync(client.loadConfig()).toBeRejectedWith(new ConfigMissing());

        expect(cwd).toHaveBeenCalled();
        expect(resolve).toHaveBeenCalledWith('test::currentPath', 'tsconfig.json');
        expect(fileExists).toHaveBeenCalledWith('test::resolvedPath');
    });

    it('should throw error when file can not be parsed', async function (): Promise<void> {
        cwd.and.returnValue('test::currentPath');
        resolve.and.returnValue('test::resolvedPath');
        fileExists.and.returnValue(true);
        readFile.and.throwError(new Error());

        await expectAsync(client.loadConfig()).toBeRejectedWith(new ConfigMissing());

        expect(cwd).toHaveBeenCalled();
        expect(resolve).toHaveBeenCalledWith('test::currentPath', 'tsconfig.json');
        expect(fileExists).toHaveBeenCalledWith('test::resolvedPath');
        expect(readFile).toHaveBeenCalledWith('test::resolvedPath', {encoding: 'utf-8'});
    });

    it('should load and parse config when file exists', async function (): Promise<void> {
        cwd.and.returnValue('test::currentPath');
        resolve.and.returnValue('test::resolvedPath');
        fileExists.and.returnValue(true);
        readFile.and.resolveTo(JSON.stringify('test::config'));
        parser.parseConfig.and.returnValue('test::parsedConfig' as MockedObject);

        const result: ConfigEntity = await client.loadConfig();

        expect(cwd).toHaveBeenCalled();
        expect(resolve).toHaveBeenCalledWith('test::currentPath', 'tsconfig.json');
        expect(fileExists).toHaveBeenCalledWith('test::resolvedPath');
        expect(readFile).toHaveBeenCalledWith('test::resolvedPath', {encoding: 'utf-8'});
        expect(parser.parseConfig).toHaveBeenCalledWith('test::config', 'test::currentPath');
        expect(result).toBe('test::parsedConfig' as MockedObject);
    });
});