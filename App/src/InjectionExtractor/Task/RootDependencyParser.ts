import ParsingTask from './ParsingTask';
import DescriptorEntity, {RequirementEntity} from '../../DescriptorEntity';
import TypeScript, {
    Identifier,
    Node,
    NodeArray,
    TypeReferenceNode,
    VariableDeclaration,
    VariableStatement
} from 'typescript';

export default class RootDependencyParser implements ParsingTask {
    public parse(node: Node, result: DescriptorEntity): void {
        if (TypeScript.isVariableStatement(node) == false) return;
        const declarations: NodeArray<VariableDeclaration> = (node as VariableStatement).declarationList.declarations;
        const rootDependency: VariableDeclaration | undefined = declarations.find(
            (vd: VariableDeclaration): boolean => (vd.name as Identifier).escapedText == 'RootDependency'
        );
        if (rootDependency === undefined) return;
        if (!rootDependency.type || !TypeScript.isTypeReferenceNode(rootDependency.type)) return;

        let requiredClass: string =
            ((rootDependency.type as TypeReferenceNode | undefined)?.typeName as Identifier).escapedText || '';

        const globalRequire: Array<RequirementEntity> = result.requires.get('') || [];
        globalRequire.push(new RequirementEntity('', requiredClass));
        result.requires.set('', globalRequire);
    }
}