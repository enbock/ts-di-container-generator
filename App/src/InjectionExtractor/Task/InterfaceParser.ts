import TypeScript, {InterfaceDeclaration, Node} from 'typescript';
import ParsingTask from './ParsingTask';
import DescriptorEntity, {InterfaceEntity} from 'Core/DescriptorEntity';

export default class InterfaceParser implements ParsingTask {
    public parse(node: Node, result: DescriptorEntity): void {
        if (TypeScript.isInterfaceDeclaration(node) == false) return;
        result.provides.push(new InterfaceEntity((node as InterfaceDeclaration).name.text));
    }
}
