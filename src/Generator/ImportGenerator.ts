import DescriptorEntity, {ImportEntity} from '../DescriptorEntity';
import TypeScript, {ImportDeclaration} from 'typescript';
import path from 'path';

export default class ImportGenerator {
    constructor(
        private dirname: typeof path.dirname
    ) {
    }

    public generate(
        descriptors: Array<DescriptorEntity>,
        basePath: string,
        targetPath: string
    ): Array<ImportDeclaration> {
        const imports: Array<ImportEntity> = this.collectImports(descriptors);

        return imports.map((i: ImportEntity) => this.generateImport(i, basePath, targetPath));
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

    private generateImport(importItem: ImportEntity, basePath: string, targetFile: string): ImportDeclaration {
        const pathParts: string[] = [
            ...this.dirname(targetFile)
                .replace(basePath, '')
                .replace(/[\/\\]/g, '|')
                .split('|')
                .filter((s: string): boolean => s != '')
                .map((): string => '..')
            ,
            ...importItem.file
                .replace(basePath, '')
                .replace(/[\/\\]/g, '|')
                .split('|')
                .filter((s: string): boolean => s != '')
        ];
        const file: string = pathParts.join('/');
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
}