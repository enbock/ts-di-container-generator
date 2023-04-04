import DescriptorEntity, {RequirementEntity} from '../../../DescriptorEntity';
import FileName from '../../../FileName';
import path from 'path';
import StringHelper from '../../../StringHelper';

export default class NameGlobalizer {
    constructor(
        private dirname: typeof path.dirname,
        private stringHelper: StringHelper
    ) {
    }

    public makeClassesGlobalUnique(descriptor: DescriptorEntity, basePath: string): void {
        for (const classItem of descriptor.provides) {
            const requirements: Array<RequirementEntity> = descriptor.requires.get(classItem.name) || [];
            descriptor.requires.delete(classItem.name);
            classItem.name = this.makeGlobalType(classItem.name, descriptor.file, basePath);
            for (const r of requirements) {
                const aliasName: string = r.import.alias.name;
                if (aliasName == '') continue;
                r.import.alias.name = this.makeGlobalType(
                    aliasName,
                    r.import.file,
                    basePath
                );
                r.parameter = this.makeGlobalProperty(
                    aliasName,
                    r.import.file,
                    basePath
                );
            }
            descriptor.requires.set(classItem.name, requirements);
        }
    }

    private makeGlobalType(name: string, file: FileName, basePath: string): string {
        const nameParts: Array<string> = this.createGlobalNamePath(file, basePath, name);
        return this.stringHelper.toPascalCase(...nameParts);
    }

    private makeGlobalProperty(name: string, file: FileName, basePath: string): string {
        const nameParts: Array<string> = this.createGlobalNamePath(file, basePath, name);
        return this.stringHelper.toCamelCase(...nameParts);
    }

    private createGlobalNamePath(file: string, basePath: string, name: string): Array<string> {
        const nameParts: Array<string> = this.dirname(file)
            .replace(basePath, '')
            .replace(/[\/\\]/g, '|')
            .split('|')
            .filter((p: string): boolean => p != '')
        ;
        nameParts.push(name);
        return nameParts;
    }
}