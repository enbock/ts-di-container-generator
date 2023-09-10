import StringHelper from 'Core/StringHelper';
import DescriptorEntity, {ClassEntity, InterfaceEntity, Type} from 'Core/DescriptorEntity';
import TypeScript, {ClassElement, GetAccessorDeclaration, SyntaxKind} from 'typescript';

export default class InterfacePropertyGenerator {
    constructor(
        private stringHelper: StringHelper
    ) {
    }

    public generate(descriptorEntities: DescriptorEntity[]): ClassElement[] {
        return descriptorEntities.map(x => this.generateForFile(x)).flat();
    }

    private generateForFile(descriptor: DescriptorEntity): ClassElement[] {
        const givenInterfaces: Array<ClassEntity> = descriptor.provides.filter(
            (p: InterfaceEntity | ClassEntity): boolean => p.type == Type.INTERFACE
        ) as Array<ClassEntity>;

        return givenInterfaces.map(x => this.generateProperty(x));
    }

    private generateProperty(interfaceElement: InterfaceEntity): GetAccessorDeclaration {
        return TypeScript.factory.createGetAccessorDeclaration(
            [
                TypeScript.factory.createModifier(SyntaxKind.PublicKeyword)
            ],
            this.stringHelper.toCamelCase(interfaceElement.name),
            [],
            TypeScript.factory.createTypeReferenceNode(interfaceElement.name),
            TypeScript.factory.createBlock(
                [
                    TypeScript.factory.createReturnStatement(
                        TypeScript.factory.createIdentifier(
                            'this.interfaceInstances.' + this.stringHelper.toCamelCase(interfaceElement.name)
                        )
                    )
                ],
                true
            )
        );
    }

}