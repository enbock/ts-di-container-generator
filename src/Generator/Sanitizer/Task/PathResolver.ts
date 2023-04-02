import DescriptorEntity from '../../../DescriptorEntity';
import path from 'path';

export default class PathResolver {
    constructor(
        private dirname: typeof path.dirname,
        private resolve: typeof path.resolve
    ) {
    }

    public makeImportPathsAbsolute(descriptor: DescriptorEntity): void {
        const dirname: string = this.dirname(descriptor.file);
        for (const i of descriptor.imports) {
            i.file = this.resolve(dirname, i.file);
        }
    }
}