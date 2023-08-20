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
        parser: Spy<Parser>
    ;

    beforeEach(function (): void {
        fileExists = createSpy();
        readFile = createSpy();
        parser = mock<Parser>();

        client = new TypeScript(
            fileExists,
            readFile,
            parser
        );
    });
    it('should throw error when file does not exist', async function (): Promise<void> {
        fileExists.and.returnValue(false);

        await expectAsync(client.loadConfig()).toBeRejectedWith(new ConfigMissing());

        expect(fileExists).toHaveBeenCalledWith('tsconfig.json');
    });

    it('should throw error when file can not be parsed', async function (): Promise<void> {
        fileExists.and.returnValue(true);
        readFile.and.throwError(new Error());

        await expectAsync(client.loadConfig()).toBeRejectedWith(new ConfigMissing());
    });

    it('should load and parse config when file exists', async function (): Promise<void> {
        fileExists.and.returnValue(true);
        readFile.and.resolveTo(JSON.stringify('test::config'));
        parser.parseConfig.and.returnValue('test::parsedConfig' as MockedObject);

        const result: ConfigEntity = await client.loadConfig();

        expect(fileExists).toHaveBeenCalled();
        expect(readFile).toHaveBeenCalled();
        expect(parser.parseConfig).toHaveBeenCalledWith('test::config');
        expect(result).toBe('test::parsedConfig' as MockedObject);
    });
});