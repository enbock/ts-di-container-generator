import ts, {InterfaceDeclaration} from 'typescript';

export default class InterfaceNodeEntity {
    constructor(
        public name: string
    ) {
    }

    public node: InterfaceDeclaration = ts.factory.createInterfaceDeclaration(
        undefined,
        'unknown',
        undefined,
        undefined,
        []
    );
}