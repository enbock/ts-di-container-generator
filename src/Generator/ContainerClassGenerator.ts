import TypeScript, {ClassElement, NodeArray, Statement, ClassDeclaration} from 'typescript';

export default class ContainerClassGenerator {
    public generate(members: ClassElement[]): NodeArray<Statement> {
        let container: ClassDeclaration = TypeScript.factory.createClassDeclaration(
            undefined,
            'Container',
            undefined,
            undefined,
            members
        );
        return TypeScript.factory.createNodeArray<Statement>([
            container,
            TypeScript.factory.createVariableStatement(
                undefined,
                TypeScript.factory.createVariableDeclarationList(
                    [
                        TypeScript.factory.createVariableDeclaration(
                            'DependencyInjectionContainer',
                            undefined,
                            TypeScript.factory.createTypeReferenceNode('Container'),
                            TypeScript.factory.createNewExpression(
                                TypeScript.factory.createIdentifier('Container'),
                                undefined,
                                []
                            )
                        )
                    ]
                )
            ),
            TypeScript.factory.createExportAssignment(
                undefined,
                undefined,
                TypeScript.factory.createIdentifier('DependencyInjectionContainer')
            )
        ]);
    }
}
