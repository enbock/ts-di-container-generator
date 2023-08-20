import DescriptorEntity, {ImportEntity} from '../../../DescriptorEntity';
import TypeScript, {ImportDeclaration} from 'typescript';
import path from 'path';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import FileName from 'Core/File/FileName';

export default class ImportGenerator {
    constructor(
        private resolve: typeof path.resolve,
        private relative: typeof path.relative,
        private normalize: typeof path.normalize
    ) {
    }

    public generate(
        descriptors: Array<DescriptorEntity>,
        basePath: string,
        config: ConfigEntity
    ): Array<ImportDeclaration> {
        const imports: Array<ImportEntity> = this.collectImports(descriptors);

        return imports.map((i: ImportEntity) => this.generateImport(i, basePath, config));
    }

    private collectImports(descriptors: Array<DescriptorEntity>): Array<ImportEntity> {
        const imports: Array<ImportEntity> = [];
        for (const d of descriptors)
            for (const i of d.imports) {
                const importInList: boolean = imports.find(((e: ImportEntity): boolean => e.file == i.file)) !=
                    undefined;
                if (importInList) continue;
                imports.push(i);
            }

        return imports;
    }

    private generateImport(importItem: ImportEntity, basePath: string, config: ConfigEntity): ImportDeclaration {
        let file: string = this.resolveImportPath(basePath, importItem, config);

        return TypeScript.factory.createImportDeclaration(
            undefined,
            TypeScript.factory.createImportClause(
                false,
                TypeScript.factory.createIdentifier(importItem.alias.name),
                undefined
            ),
            TypeScript.factory.createStringLiteral(
                file,
                true
            )
        );
    }

    private resolveImportPath(basePath: string, importItem: ImportEntity, config: ConfigEntity): string {
        const containerPath: string = this.resolve(basePath, './DependencyInjection');
        const importFilePath: FileName = this.resolve(importItem.file);
        let file: string = this.relative(containerPath, importFilePath);

        for (const alias of config.pathAliases) {
            const configBasePath = this.resolve(config.basePath, alias.targetPath);
            if (importFilePath.length < configBasePath.length) continue;
            if (importFilePath.substring(0, configBasePath.length) != configBasePath) continue;
            file = this.normalize(alias.name + '/' + this.relative(configBasePath, importFilePath));
            break;
        }

        return file.replace(/\\/g, '/');
    }
}