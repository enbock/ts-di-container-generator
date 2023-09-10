import ts from 'typescript';
import TypeScript, {ClassDeclaration, Identifier, Node, PropertyDeclaration, SyntaxKind} from 'typescript';
import NodeEntity from 'Core/File/NodeEntity';
import ManualCodeEntity from 'Core/ManualCodeUseCase/ManualCodeEntity';

export default class PropertyExtractor {
    public parse(
        node: ts.Node,
        propertyName: string,
        typeName: string,
        className: string,
        data: ManualCodeEntity
    ): void {
        if (TypeScript.isClassDeclaration(node) == false) return;
        if ((node as ClassDeclaration).name?.escapedText != className) return;

        ts.forEachChild(node, (child: Node): void => this.appendChildToData(child, propertyName, typeName, data));

        if (!data.manualCode[propertyName]) data.manualCode[propertyName] = this.createDefaultProperty(
            propertyName,
            typeName
        );
    }

    private appendChildToData(
        child: Node,
        propertyName: string,
        typeName: string,
        data: ManualCodeEntity
    ): void {
        if (TypeScript.isPropertyDeclaration(child) == false) return;

        const result: NodeEntity = new NodeEntity('');
        const found: boolean = this.parseNode(child as PropertyDeclaration, result, propertyName);

        if (found == false) return;
        data.manualCode[result.name] = result;
    }

    private createDefaultProperty(propertyName: string, typeName: string): NodeEntity {
        const result: NodeEntity = new NodeEntity(propertyName);
        result.node = ts.factory.createPropertyDeclaration(
            [
                ts.factory.createModifier(SyntaxKind.PrivateKeyword)
            ],
            propertyName,
            undefined,
            ts.factory.createTypeReferenceNode(typeName),
            ts.factory.createObjectLiteralExpression()
        );

        return result;
    }

    private parseNode(node: PropertyDeclaration, result: NodeEntity, requestedName: string): boolean {
        const name: string = String((node.name as Identifier).escapedText);
        if (name.indexOf(requestedName) != 0) return false;

        result.name = name;
        result.node = node;

        return true;
    }
}