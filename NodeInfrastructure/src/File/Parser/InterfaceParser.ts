import TypeScript, {InterfaceDeclaration, Node} from 'typescript';
import Parser from './Parser';
import DescriptorEntity, {InterfaceEntity} from 'Core/DescriptorEntity';

export default class InterfaceParser implements Parser {
    public parse(node: Node, result: DescriptorEntity): void {
        if (TypeScript.isInterfaceDeclaration(node) == false) return;
        result.provides.push(new InterfaceEntity((node as InterfaceDeclaration).name.text));
    }
}
