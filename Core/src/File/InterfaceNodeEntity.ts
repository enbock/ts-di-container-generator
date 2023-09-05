import ts, {InterfaceDeclaration} from 'typescript';
import {ImportEntity} from 'Core/DescriptorEntity';

export default class InterfaceNodeEntity {
    constructor(
        public name: string
    ) {
    }

    public imports: Array<ImportEntity> = [];
    public node: InterfaceDeclaration = ts.factory.createInterfaceDeclaration(
        undefined,
        'unknown',
        undefined,
        undefined,
        []
    );
}