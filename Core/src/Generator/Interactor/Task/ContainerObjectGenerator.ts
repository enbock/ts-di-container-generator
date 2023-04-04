import StringHelper from '../../../StringHelper';
import TypeScript, {
    ClassElement,
    Expression,
    GetAccessorDeclaration,
    Identifier,
    PropertyAccessExpression,
    PropertyDeclaration,
    SyntaxKind
} from 'typescript';
import DescriptorEntity, {ClassEntity, InterfaceEntity, RequirementEntity, Type} from '../../../DescriptorEntity';

export default class ContainerObjectGenerator {
    constructor(
        private stringHelper: StringHelper
    ) {
    }

    public generate(descriptors: DescriptorEntity[]): ClassElement[] {
        const result: ClassElement[] = [];
        for (const descriptor of descriptors) {
            const givenClasses: Array<InterfaceEntity | ClassEntity> = descriptor.provides.filter(
                (p: InterfaceEntity | ClassEntity): boolean => p.type == Type.CLASS
            );
            for (const givenClass of givenClasses) {
                result.push(
                    this.generateProperty(givenClass)
                );
                result.push(
                    this.generateGetter(givenClass, descriptor)
                );
            }
        }

        return result;
    }

    private generateProperty(givenClass: ClassEntity): PropertyDeclaration {
        return TypeScript.factory.createPropertyDeclaration(
            [
                TypeScript.factory.createModifier(SyntaxKind.PrivateKeyword)
            ],
            '_' + this.stringHelper.toCamelCase(givenClass.name),
            TypeScript.factory.createToken(SyntaxKind.QuestionToken),
            TypeScript.factory.createTypeReferenceNode(givenClass.name),
            undefined
        );
    }

    private generateGetter(givenClass: ClassEntity, descriptor: DescriptorEntity): GetAccessorDeclaration {
        const classProperty: PropertyAccessExpression = TypeScript.factory.createPropertyAccessExpression(
            TypeScript.factory.createThis(),
            '_' + this.stringHelper.toCamelCase(givenClass.name)
        );
        return TypeScript.factory.createGetAccessorDeclaration(
            [
                TypeScript.factory.createModifier(SyntaxKind.PublicKeyword)
            ],
            this.stringHelper.toCamelCase(givenClass.name),
            [],
            TypeScript.factory.createTypeReferenceNode(givenClass.name),
            TypeScript.factory.createBlock(
                [
                    TypeScript.factory.createIfStatement(
                        classProperty,
                        TypeScript.factory.createReturnStatement(
                            classProperty
                        ),
                        TypeScript.factory.createReturnStatement(
                            TypeScript.factory.createBinaryExpression(
                                classProperty,
                                TypeScript.factory.createToken(
                                    SyntaxKind.EqualsToken
                                ),
                                TypeScript.factory.createNewExpression(
                                    TypeScript.factory.createIdentifier(givenClass.name),
                                    [],
                                    this.generateRequirements(descriptor, givenClass)
                                )
                            )
                        )
                    )
                ]
            )
        );
    }

    private generateRequirements(descriptor: DescriptorEntity, givenClass: ClassEntity): Expression[] {
        const requirements: RequirementEntity[] = descriptor.requires.get(givenClass.name) || [];
        return requirements.map(
            (r: RequirementEntity): Identifier => TypeScript.factory.createIdentifier(
                'this.' + (
                    r.type && r.import.file
                        ? r.parameter
                        : 'manualInjections.' +
                        this.stringHelper.toCamelCase(givenClass.name, r.type || r.parameter)
                )
            )
        );
    }
}