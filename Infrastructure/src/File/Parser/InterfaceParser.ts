import TypeScript, {InterfaceDeclaration, Node, SyntaxKind} from 'typescript';
import Parser from './Parser';
import DescriptorEntity, {InterfaceEntity} from 'Core/DescriptorEntity';

export default class InterfaceParser implements Parser {
    public parse(node: Node, result: DescriptorEntity): void {
        if (TypeScript.isInterfaceDeclaration(node) == false) return;
        const interfaceNode: InterfaceDeclaration = node as InterfaceDeclaration;
        if (interfaceNode.modifiers === undefined) return;
        if (interfaceNode.modifiers.find(x => x.kind == SyntaxKind.ExportKeyword) === undefined) return;
        result.provides.push(new InterfaceEntity((node as InterfaceDeclaration).name.text));
    }
}
