import {Node} from 'typescript';
import DescriptorEntity from 'Core/DescriptorEntity';

export default interface ParsingTask {
    parse(node: Node, result: DescriptorEntity): void;
}
