import TypeScript, {
    Identifier,
    ImportClause,
    ImportDeclaration,
    NamedImports,
    NamespaceImport,
    Node,
    SyntaxKind
} from 'typescript';
import Parser from './Parser';
import FileName from 'Core/File/FileName';
import DescriptorEntity, {AliasEntity, ImportEntity} from 'Core/DescriptorEntity';

export default class ImportParser implements Parser {
    public parse(node: Node, result: DescriptorEntity): void {
        if (TypeScript.isImportDeclaration(node) == false) return;

        const importDeclaration: ImportDeclaration = node as ImportDeclaration;
        if (importDeclaration.importClause == undefined) return;

        const modulePath: FileName = String((importDeclaration.moduleSpecifier as any).text);
        this.parseImportClause(importDeclaration.importClause, result, modulePath);
    }

    private parseImportClause(node: ImportClause, result: DescriptorEntity, modulePath: string): void {
        if (node.name) this.parseImportName(node.name, result, modulePath);
        if (node.namedBindings) this.parseBindingNames(node.namedBindings, modulePath, result);
    }

    private parseImportName(node: Identifier, result: DescriptorEntity, modulePath: string): void {
        let alias: AliasEntity = new AliasEntity(String(node.escapedText));
        let importAlias: ImportEntity = new ImportEntity(modulePath, alias);
        this.correctPathAndSave(importAlias, result);
    }

    private correctPathAndSave(importAlias: ImportEntity, result: DescriptorEntity): void {
        result.imports.push(importAlias);
    }

    private parseBindingNames(
        node: NamespaceImport | NamedImports,
        modulePath: string,
        result: DescriptorEntity
    ): void {
        if (node.kind == SyntaxKind.NamespaceImport) this.addNamespace(node as NamespaceImport, modulePath, result);
        else this.addNamedImports(node as NamedImports, modulePath, result);
    }

    private addNamespace(node: NamespaceImport, modulePath: string, result: DescriptorEntity): void {
        let alias: AliasEntity = new AliasEntity(String(node.name.escapedText));
        let importAlias: ImportEntity = new ImportEntity(modulePath, alias);
        result.imports.push(importAlias);
        this.correctPathAndSave(importAlias, result);
    }

    private addNamedImports(node: NamedImports, modulePath: string, result: DescriptorEntity): void {
        for (const element of node.elements) {
            let alias: AliasEntity = new AliasEntity(String(element.name.escapedText));
            if (element.propertyName) alias.origin = String(element.propertyName.escapedText);
            let importAlias: ImportEntity = new ImportEntity(modulePath, alias);
            result.imports.push(importAlias);
        }
    }
}
