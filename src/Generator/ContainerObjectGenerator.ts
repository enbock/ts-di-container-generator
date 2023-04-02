import StringHelper from '../StringHelper';
import TypeScript, {ClassElement, Expression, Identifier, PropertyDeclaration, SyntaxKind} from 'typescript';
import DescriptorEntity, {InterfaceEntity, RequirementEntity, Type} from '../DescriptorEntity';

export default class ContainerObjectGenerator {
    constructor(
        private stringHelper: StringHelper
    ) {
    }

    public generate(descriptors: DescriptorEntity[]): ClassElement[] {
        const result: ClassElement[] = [];
        for (const descriptor of descriptors) {
            const givenClasses: InterfaceEntity[] = descriptor.provides.filter(
                (p: InterfaceEntity): boolean => p.type == Type.CLASS
            );
            for (const givenClass of givenClasses) {
                result.push(
                    this.generateProperty(givenClass, descriptor)
                );
            }
        }

        return result;
    }

    private generateProperty(givenClass: InterfaceEntity, descriptor: DescriptorEntity): PropertyDeclaration {
        return TypeScript.factory.createPropertyDeclaration(
            [
                TypeScript.factory.createModifier(SyntaxKind.PublicKeyword)
            ],
            this.stringHelper.toCamelCase(givenClass.name),
            undefined,
            TypeScript.factory.createTypeReferenceNode(givenClass.name),
            TypeScript.factory.createNewExpression(
                TypeScript.factory.createIdentifier(givenClass.name),
                [],
                this.generateRequirements(descriptor, givenClass)
            )
        );
    }

    private generateRequirements(descriptor: DescriptorEntity, givenClass: InterfaceEntity): Expression[] {
        const requirements: RequirementEntity[] = descriptor.requires.get(givenClass.name) || [];
        return requirements.map(
            (r: RequirementEntity): Identifier => TypeScript.factory.createIdentifier(
                'this.' + (
                    this.stringHelper.toCamelCase(r.type)
                    || 'manualInjections.' + this.stringHelper.toCamelCase(
                        givenClass.name,
                        r.parameter,
                        'Value'
                    )
                )
            )
        );
    }
}