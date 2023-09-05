import TypeScript, {InterfaceDeclaration, Node} from 'typescript';
import InterfaceNodeEntity from 'Core/File/InterfaceNodeEntity';

export default class NamedInterfaceParser {
    public parse(node: Node, result: InterfaceNodeEntity, requestedName: string): void {
        if (TypeScript.isInterfaceDeclaration(node) == false) return;

        const name: string = (node as InterfaceDeclaration).name.text;
        if (name != requestedName) return;

        result.name = name;
        result.node = node as InterfaceDeclaration;
    }
}
