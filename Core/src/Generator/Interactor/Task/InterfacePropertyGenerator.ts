import StringHelper from 'Core/StringHelper';
import DescriptorEntity, {ClassEntity, InterfaceEntity, Type} from 'Core/DescriptorEntity';
import TypeScript, {ClassElement, PropertyDeclaration, SyntaxKind} from 'typescript';

export default class InterfacePropertyGenerator {
    constructor(
        private stringHelper: StringHelper
    ) {
    }

    // idee: this.implementations.coreFileFileClient
    public generate(descriptorEntities: DescriptorEntity[]): ClassElement[] {
        return descriptorEntities.map(x => this.generateForFile(x)).flat();
    }

    private generateForFile(descriptor: DescriptorEntity): ClassElement[] {
        const givenInterfaces: Array<ClassEntity> = descriptor.provides.filter(
            (p: InterfaceEntity | ClassEntity): boolean => p.type == Type.INTERFACE
        ) as Array<ClassEntity>;

        return givenInterfaces.map(x => this.generateProperty(x));
    }

    private generateProperty(interfaceElement: InterfaceEntity): PropertyDeclaration {
        return TypeScript.factory.createPropertyDeclaration(
            [
                TypeScript.factory.createModifier(SyntaxKind.PublicKeyword)
            ],
            this.stringHelper.toCamelCase(interfaceElement.name),
            undefined,
            TypeScript.factory.createTypeReferenceNode(interfaceElement.name),
            TypeScript.factory.createIdentifier(
                'this.interfaceInstances.' + this.stringHelper.toCamelCase(interfaceElement.name)
            )
        );
    }

}