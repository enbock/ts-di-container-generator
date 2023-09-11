import Parser from './Parser';
import {Spy} from 'jasmine-auto-spies';
import mock from 'Core/mock';
import ParseHelper from 'Infrastructure/ParseHelper';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import MockedObject from 'Core/MockedObject';
import createSpy = jasmine.createSpy;

describe('Parser', function (): void {
    let parser: Parser,
        parseHelper: Spy<ParseHelper>,
        resolve: jasmine.Spy
    ;

    beforeEach(function (): void {
        parseHelper = mock<ParseHelper>();
        resolve = createSpy();

        parser = new Parser(
            parseHelper,
            resolve
        );
    });

    it('should parse ConfigEntity from data with one valid target path', async function (): Promise<void> {
        const data: MockedObject = {
            compilerOptions: {
                paths: {
                    'test::key/*': ['test::path/*']
                },
                baseUrl: 'test::baseUrl'
            }
        };

        parseHelper.get.withArgs(data, 'compilerOptions.baseUrl', '.')
            .and
            .returnValue(data.compilerOptions.baseUrl);
        parseHelper.get.withArgs(data, 'compilerOptions.paths', []).and.returnValue(data.compilerOptions.paths);

        resolve.and.callFake(function (path1: string, path2: string): string {
            return path1 + '/' + path2;
        });

        const result: ConfigEntity = await parser.parseConfig(data, 'test::basePath');

        expect(parseHelper.get).toHaveBeenCalledWith(data, 'compilerOptions.paths', []);
        expect(resolve).toHaveBeenCalledWith('test::basePath', 'test::baseUrl');
        expect(result.pathAliases[0].regExp).toEqual(new RegExp('^test::key/'));
        expect(result.pathAliases[0].targetPath).toBe('test::path/');
        expect(result.pathAliases[0].name).toBe('test::key/');
        expect(result.basePath).toBe('test::basePath/test::baseUrl');
    });

    it(
        'should parse and ignore keys with empty target path when no target path in data',
        async function (): Promise<void> {
            const data: MockedObject = {
                compilerOptions: {
                    paths: {
                        'test::key/*': []
                    }
                }
            };

            parseHelper.get.withArgs(data, 'compilerOptions.baseUrl', '.').and.returnValue(undefined);
            parseHelper.get.withArgs(data, 'compilerOptions.paths', []).and.returnValue(data.compilerOptions.paths);

            resolve.and.callFake(function (path1: string, path2: string): string {
                return path1 + '/' + path2;
            });

            const result: ConfigEntity = await parser.parseConfig(data, 'test::basePath');

            expect(parseHelper.get).toHaveBeenCalledWith(data, 'compilerOptions.paths', []);
            expect(result.pathAliases).toEqual([]);
            expect(result.basePath).toBe('test::basePath/.');
        }
    );
});