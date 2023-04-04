import DescriptorEntity, {RequirementEntity} from 'Core/DescriptorEntity';
import StringHelper from 'Core/StringHelper';
import FileName from 'Core/File/FileName';
import path from 'path';

export default class FallbackRequireNameCreator {
    constructor(
        private dirname: typeof path.dirname,
        private stringHelper: StringHelper
    ) {
    }

    public addRequireName(descriptor: DescriptorEntity, basePath: string): void {
        const requirements: Array<RequirementEntity> = [...descriptor.requires.values()].flat();
        for (const r of requirements) {
            if (r.parameter) continue;
            if (r.import.file == '') continue;
            r.parameter = this.makeGlobalProperty(r.type, r.import.file, basePath);
            r.type = this.makeGlobalType(r.type, r.import.file, basePath);
            r.import.alias.name = r.type;
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