import DescriptorEntity, {ImportEntity, RequirementEntity} from '../../../DescriptorEntity';

export default class RequirementResolver {
    public revolveRequiredImports(descriptor: DescriptorEntity): void {
        const requirements: IterableIterator<Array<RequirementEntity>> = descriptor.requires.values();
        for (const requirementBlock of requirements)
            for (const requirement of requirementBlock) {
                const importItem: ImportEntity | undefined = descriptor.imports.find(
                    (i: ImportEntity): boolean => i.alias.name == requirement.type
                );
                if (importItem === undefined) continue;
                requirement.import = importItem;
            }
    }
}