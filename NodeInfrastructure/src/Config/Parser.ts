import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';
import ParseHelper from 'Infrastructure/ParseHelper';
import FileName from 'Core/File/FileName';

export default class Parser {
    constructor(
        private parseHelper: ParseHelper
    ) {
    }

    public async parseConfig(data: object): Promise<ConfigEntity> {
        const entity: ConfigEntity = new ConfigEntity();
        const pathConfig: object = this.parseHelper.get<object>(data, 'compilerOptions.paths', []) || [];
        const keys: Array<keyof object> = Object.keys(pathConfig) as Array<keyof object>;

        entity.pathAliases = keys
            .map((k: keyof object) => this.parseAlias(k, pathConfig[k]))
            .filter(a => a.targetPath != '')
        ;

        return entity;
    }

    private parseAlias(key: string, config: object): PathAlias {
        const alias: PathAlias = new PathAlias();
        alias.regExp = new RegExp('^' + key);
        const paths: Array<FileName> = config instanceof Array ? config : [];
        alias.targetPath = paths.length > 0 ? paths[0] : '';
        return alias;
    }
}