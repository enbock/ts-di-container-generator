import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';
import ParseHelper from 'Infrastructure/ParseHelper';
import FileName from 'Core/File/FileName';
import path from 'path';

export default class Parser {
    constructor(
        private parseHelper: ParseHelper,
        private resolve: typeof path.resolve
    ) {
    }

    public async parseConfig(data: object, currentPath: string): Promise<ConfigEntity> {
        const entity: ConfigEntity = new ConfigEntity();
        const pathConfig: object = this.parseHelper.get<object>(data, 'compilerOptions.paths', []) || [];
        const keys: Array<keyof object> = Object.keys(pathConfig) as Array<keyof object>;

        entity.pathAliases = keys
            .map((k: keyof object) => this.parseAlias(k, pathConfig[k]))
            .filter(a => a.targetPath != '')
        ;
        entity.basePath = this.resolve(
            currentPath,
            this.parseHelper.get<string>(data, 'compilerOptions.baseUrl', '.') || '.'
        );

        return entity;
    }

    private parseAlias(key: string, config: object): PathAlias {
        const alias: PathAlias = new PathAlias();
        const name: string = key.replace(/\/\*$/, '/');
        alias.regExp = new RegExp('^' + name);
        alias.name = name;
        const paths: Array<FileName> = config instanceof Array ? config : [];
        alias.targetPath = (paths.length > 0 ? paths[0] : '').replace(/\/\*$/, '/');
        return alias;
    }
}