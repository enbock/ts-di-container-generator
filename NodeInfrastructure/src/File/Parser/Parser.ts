import {Node} from 'typescript';
import DescriptorEntity from 'Core/DescriptorEntity';

export default interface Parser {
    parse(node: Node, result: DescriptorEntity): void;
}
