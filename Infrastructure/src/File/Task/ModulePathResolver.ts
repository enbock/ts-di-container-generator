import ConfigEntity, {PathAlias} from 'Core/Configuration/ConfigEntity';
import path from 'path';

export default class ModulePathResolver {
    constructor(
        private resolve: typeof path.resolve
    ) {
    }

    public resolvePath(basePath: string, file: string, config: ConfigEntity): string {
        const globalPathAlias: PathAlias | undefined = config.pathAliases.find(pa => pa.regExp.test(file));
        if (globalPathAlias === undefined) return this.resolve(basePath, file);
        return this.resolve(config.basePath, file.replace(globalPathAlias.regExp, globalPathAlias.targetPath));
    }
}