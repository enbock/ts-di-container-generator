import TypeScript, {ClassDeclaration, ClassElement, NodeArray, Statement, VariableStatement} from 'typescript';

export default class ContainerClassGenerator {
    public generate(members: ClassElement[]): NodeArray<Statement> {
        let container: ClassDeclaration = TypeScript.factory.createClassDeclaration(
            undefined,
            'Container',
            undefined,
            undefined,
            members
        );
        const creationStatement: VariableStatement = TypeScript.factory.createVariableStatement(
            undefined, // [TypeScript.factory.createModifier(SyntaxKind.ConstKeyword)], // const var result
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
        );
        return TypeScript.factory.createNodeArray<Statement>([
            container,
            creationStatement,
            TypeScript.factory.createExportAssignment(
                undefined,
                undefined,
                TypeScript.factory.createIdentifier('DependencyInjectionContainer')
            )
        ]);
    }
}
