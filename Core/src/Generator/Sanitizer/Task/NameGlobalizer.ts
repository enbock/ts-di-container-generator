import DescriptorEntity, {ClassEntity, InterfaceEntity, RequirementEntity} from '../../../DescriptorEntity';
import FileName from '../../../File/FileName';
import path from 'path';
import StringHelper from '../../../StringHelper';
import ConfigEntity from 'Core/Configuration/ConfigEntity';

export default class NameGlobalizer {
    constructor(
        private dirname: typeof path.dirname,
        private stringHelper: StringHelper,
        private normalize: typeof path.normalize
    ) {
    }

    public makeClassesGlobalUnique(descriptor: DescriptorEntity, basePath: string, config: ConfigEntity): void {
        for (const providingItem of descriptor.provides) {
            const requirements: Array<RequirementEntity> = descriptor.requires.get(providingItem.name) || [];
            descriptor.requires.delete(providingItem.name);
            if (
                (providingItem instanceof ClassEntity && providingItem.isDefault) ||
                providingItem instanceof InterfaceEntity
            )
                providingItem.name = this.makeGlobalType(providingItem.name, descriptor.file, basePath, config);
            for (const r of requirements) {
                const aliasName: string = r.import.alias.name;
                if (aliasName == '') continue;
                r.import.alias.name = this.makeGlobalType(aliasName, r.import.file, basePath, config);
                r.parameter = this.makeGlobalProperty(aliasName, r.import.file, basePath, config);
            }
            descriptor.requires.set(providingItem.name, requirements);
        }
    }

    private makeGlobalType(name: string, file: FileName, basePath: string, config: ConfigEntity): string {
        const nameParts: Array<string> = this.createGlobalNamePath(file, basePath, name, config);
        return this.stringHelper.toPascalCase(...nameParts);
    }

    private makeGlobalProperty(name: string, file: FileName, basePath: string, config: ConfigEntity): string {
        const nameParts: Array<string> = this.createGlobalNamePath(file, basePath, name, config);
        return this.stringHelper.toCamelCase(...nameParts);
    }

    private createGlobalNamePath(file: string, basePath: string, name: string, config: ConfigEntity): Array<string> {
        let pathName: string = this.dirname(file)
                .replace(basePath, '')
                .replace(config.basePath, '')
                .replace(/\\/g, '/')
            + '/';

        config.pathAliases.forEach(x => pathName = pathName.replace(x.targetPath, x.name));
        pathName = this.normalize(pathName);

        const nameParts: Array<string> = pathName.replace(/[\/\\]/g, '|')
            .split('|')
            .filter((p: string): boolean => p != '')
        ;
        nameParts.push(name);
        return nameParts;
    }
}