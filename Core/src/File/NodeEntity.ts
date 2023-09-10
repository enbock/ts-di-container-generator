import ts, {Node} from 'typescript';
import {ImportEntity} from 'Core/DescriptorEntity';

export default class NodeEntity {
    constructor(
        public name: string
    ) {
    }

    public imports: Array<ImportEntity> = [];
    public node: Node = ts.factory.createNull();
}