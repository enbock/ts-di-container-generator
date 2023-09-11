import TypeScript from 'typescript';
import ts, {
    Identifier,
    InterfaceDeclaration,
    Node,
    PropertySignature,
    Type,
    TypeElement,
    TypeQueryNode,
    TypeReference,
    TypeReferenceNode
} from 'typescript';
import NodeEntity from 'Core/File/NodeEntity';
import {ImportEntity} from 'Core/DescriptorEntity';

export default class InterfaceExtractor {
    public parse(node: Node, result: NodeEntity, requestedName: string, imports: Array<ImportEntity>): void {
        if (TypeScript.isInterfaceDeclaration(node) == false) return;

        const interfaceNode: InterfaceDeclaration = node as InterfaceDeclaration;
        const name: string = interfaceNode.name.text;
        if (name != requestedName) return;

        result.name = name;
        result.node = interfaceNode;

        interfaceNode.members.forEach(
            x => this.addInterface(x as any, imports, result.imports)
        );
    }

    private addInterface(
        node: TypeElement,
        allImports: Array<ImportEntity>,
        neededImports: Array<ImportEntity>
    ): void {
        if (ts.isPropertySignature(node) == false) return;
        const propNode: PropertySignature = node as PropertySignature;
        if (propNode.type === undefined) return;
        if (
            ts.isTypeReferenceNode(propNode.type) == false
            && ts.isTypeQueryNode(propNode.type) == false
        ) return;

        let typeName: string = ts.isTypeReferenceNode(propNode.type)
            ? String(((propNode.type as TypeReferenceNode).typeName as Identifier).escapedText)
            : String(((propNode.type as TypeQueryNode).exprName as Identifier).escapedText)
        ;

        typeName = this.takeFromTypeArguments(propNode, typeName);

        const foundImport: ImportEntity | undefined = allImports.find(
            x => x.alias.name == typeName || (x.alias.origin != '' && x.alias.origin == typeName)
        );
        if (foundImport === undefined) return;

        if (neededImports.indexOf(foundImport) != -1) return;
        neededImports.push(foundImport);
    }

    private takeFromTypeArguments(propNode: ts.PropertySignature, typeName: string): string {
        const typeArguments: readonly Type[] | undefined = (<TypeReference | undefined><unknown>propNode.type)?.typeArguments;
        if (typeArguments == undefined || typeArguments.length == 0) return typeName;

        const typeNode: TypeReferenceNode = <TypeReferenceNode><unknown>typeArguments[0];
        if (ts.isTypeReferenceNode(typeNode) == false) return typeName;

        return String((<Identifier>typeNode.typeName).escapedText);
    }
}
