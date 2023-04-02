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
            classItem.name = this.makeGlobal(classItem.name, descriptor.file, basePath);
            descriptor.requires.set(classItem.name, requirements);
        }
    }

    private makeGlobal(name: string, file: FileName, basePath: string): string {
        const nameParts: Array<string> = this.dirname(file)
            .replace(basePath, '')
            .replace(/[\/\\]/g, ':')
            .split(':')
            .filter((p: string): boolean => p != '')
        ;
        nameParts.push(name);
        return this.stringHelper.toPascalCase(...nameParts);
    }
}