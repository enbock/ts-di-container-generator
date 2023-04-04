import {Node} from 'typescript';
import DescriptorEntity from '../../DescriptorEntity';

export default interface ParsingTask {
    parse(node: Node, result: DescriptorEntity): void;
}
