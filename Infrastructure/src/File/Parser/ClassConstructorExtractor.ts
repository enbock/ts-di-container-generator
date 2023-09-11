import ts from 'typescript';
import TypeScript, {ClassDeclaration, ConstructorDeclaration} from 'typescript';
import NodeEntity from 'Core/File/NodeEntity';

export default class ClassConstructorExtractor {
    public parse(node: ts.Node, result: NodeEntity, className: string): void {
        if (TypeScript.isClassDeclaration(node) == false) return;
        if ((node as ClassDeclaration).name?.escapedText != className) return;

        ts.forEachChild(node, c => this.parseNode(c as ConstructorDeclaration, result));
    }

    private parseNode(node: ConstructorDeclaration, result: NodeEntity): void {
        if (TypeScript.isConstructorDeclaration(node) == false) return;

        result.name = 'constructor';
        result.node = node;
    }
}