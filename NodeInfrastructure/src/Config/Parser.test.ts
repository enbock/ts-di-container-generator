import Parser from './Parser';
import {Spy} from 'jasmine-auto-spies';
import mock from 'Core/mock';
import ParseHelper from 'Infrastructure/ParseHelper';
import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';
import MockedObject from 'Core/MockedObject';

describe('Parser', function (): void {
    let parser: Parser,
        parseHelper: Spy<ParseHelper>
    ;

    beforeEach(function (): void {
        parseHelper = mock<ParseHelper>();

        parser = new Parser(
            parseHelper
        );
    });
    it('should parse config and return ConfigEntity', async function (): Promise<void> {
        const data: MockedObject = {
            compilerOptions: {
                paths: {
                    'test::key': ['test::path']
                }
            }
        };
        const configEntity: ConfigEntity = new ConfigEntity();
        const pathAlias: PathAlias = new PathAlias();
        pathAlias.regExp = new RegExp('^test::key');
        pathAlias.targetPath = 'test::path';
        configEntity.pathAliases = [pathAlias];

        parseHelper.get.and.returnValue(data.compilerOptions.paths);

        const result: ConfigEntity = await parser.parseConfig(data);

        expect(parseHelper.get).toHaveBeenCalledWith(data, 'compilerOptions.paths', []);
        expect(result).toEqual(configEntity);
    });

    it('should parse config and ignore keys with empty target path', async function (): Promise<void> {
        const data: MockedObject = {
            compilerOptions: {
                paths: {
                    'test::key': []
                }
            }
        };
        const configEntity: ConfigEntity = new ConfigEntity();
        configEntity.pathAliases = [];

        parseHelper.get.and.returnValue(data.compilerOptions.paths);

        const result: ConfigEntity = await parser.parseConfig(data);

        expect(parseHelper.get).toHaveBeenCalledWith(data, 'compilerOptions.paths', []);
        expect(result).toEqual(configEntity);
    });
});