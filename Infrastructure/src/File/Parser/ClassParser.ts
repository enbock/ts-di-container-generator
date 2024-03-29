import Parser from './Parser';
import TypeScript, {
    ClassDeclaration,
    ConstructorDeclaration,
    Identifier,
    Node,
    ParameterDeclaration,
    SyntaxKind
} from 'typescript';
import DescriptorEntity, {ClassEntity, RequirementEntity} from 'Core/DescriptorEntity';

export default class ClassParser implements Parser {
    public parse(node: Node, result: DescriptorEntity): void {
        if (TypeScript.isClassDeclaration(node) == false) return;
        const classNode: ClassDeclaration = node as ClassDeclaration;
        if (classNode.modifiers === undefined) return;
        if (classNode.modifiers.find(x => x.kind == SyntaxKind.ExportKeyword) === undefined) return;

        const name: string = (node as ClassDeclaration).name?.text || 'Anonymous';
        const isDefault = classNode.modifiers.find(x => x.kind == SyntaxKind.DefaultKeyword) !== undefined;
        result.provides.push(new ClassEntity(name, isDefault));
        this.parseRequirements(name, node as ClassDeclaration, result);
    }

    private parseRequirements(className: string, node: ClassDeclaration, result: DescriptorEntity): void {
        let requirements: RequirementEntity[] = result.requires.get(className) || [];
        TypeScript.forEachChild(node, (child: Node) => this.parseConstructor(child, requirements));
        result.requires.set(className, requirements);
    }

    private parseConstructor(node: Node, requirements: RequirementEntity[]): void {
        if (TypeScript.isConstructorDeclaration(node) == false) return;
        for (const param of (node as ConstructorDeclaration).parameters)
            this.addRequirement(param, requirements);
    }

    private addRequirement(node: ParameterDeclaration, requirements: RequirementEntity[]): void {
        const requirement: RequirementEntity = new RequirementEntity('');

        requirement.parameter = String((node.name as Identifier).escapedText || '');

        if (node.type && TypeScript.isTypeReferenceNode(node.type))
            requirement.type = String((node.type.typeName as Identifier).escapedText || '');

        requirements.push(requirement);
    }
}
