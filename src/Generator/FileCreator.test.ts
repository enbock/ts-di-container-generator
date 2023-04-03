import FileCreator from './FileCreator';
import fs from 'fs';
import TypeScript, {
    ClassDeclaration,
    ClassElement,
    ImportDeclaration,
    NodeArray,
    Statement,
    SyntaxKind
} from 'typescript';
import ContainerObjectGenerator from './ContainerObjectGenerator';
import ContainerClassGenerator from './ContainerClassGenerator';
import StringHelper from '../StringHelper';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import MockedObject from '../MockedObject';
import ImportGenerator from './ImportGenerator';
import SpyFn = jasmine.Spy;

describe('FileCreator', function (): void {
    let fileGenerator: FileCreator,
        statementGenerator: Spy<ContainerClassGenerator>,
        objectGenerator: Spy<ContainerObjectGenerator>,
        writeFile: SpyFn<typeof fs.promises.writeFile>,
        importGenerator: Spy<ImportGenerator>
    ;

    beforeEach(function (): void {
        statementGenerator = createSpyFromClass(ContainerObjectGenerator);
        objectGenerator = createSpyFromClass(ContainerObjectGenerator);
        writeFile = jasmine.createSpy();
        importGenerator = createSpyFromClass(ImportGenerator);

        fileGenerator = new FileCreator(
            new StringHelper(),
            statementGenerator,
            objectGenerator,
            writeFile,
            importGenerator
        );
    });

    function createTestProperty(): ClassElement {
        return TypeScript.factory.createPropertyDeclaration(
            [
                TypeScript.factory.createModifier(SyntaxKind.PublicKeyword)
            ],
            'testProperty',
            undefined,
            TypeScript.factory.createTypeReferenceNode('string'),
            TypeScript.factory.createNewExpression(
                TypeScript.factory.createIdentifier('TestClass'),
                [],
                []
            )
        );
    }

    function createTestStatements(): NodeArray<Statement> {
        const container: ClassDeclaration = TypeScript.factory.createClassDeclaration(
            undefined,
            'OutputClass',
            undefined,
            undefined,
            [createTestProperty()]
        );
        return TypeScript.factory.createNodeArray<Statement>([container]);
    }

    function createTestImports(): Array<ImportDeclaration> {
        return [
            TypeScript.factory.createImportDeclaration(
                undefined,
                TypeScript.factory.createImportClause(
                    false,
                    TypeScript.factory.createIdentifier('test::import:'),
                    undefined
                ),
                TypeScript.factory.createStringLiteral('test::file:')
            )
        ];
    }

    it('should generate TypeScript file', function (): void {
        const testProperties: ClassElement[] = [createTestProperty()];
        objectGenerator.generate.and.returnValue(testProperties);
        statementGenerator.generate.and.returnValue(createTestStatements());
        importGenerator.generate.and.returnValue(createTestImports());

        fileGenerator.generate('test::descriptors:' as MockedObject, 'test::basePath:', 'test::targetFile:');

        expect(objectGenerator.generate).toHaveBeenCalledWith('test::descriptors:');
        expect(statementGenerator.generate).toHaveBeenCalledWith(testProperties);
        expect(importGenerator.generate).toHaveBeenCalledWith(
            'test::descriptors:',
            'test::basePath:',
            'test::targetFile:'
        );
        expect(writeFile).toHaveBeenCalledWith(
            'test::targetFile:',
            `// @formatter:off
import test::import: from "test::file:";
class OutputClass {
    public testProperty: string = new TestClass();
}
`,
            {flag: 'w'}
        );
    });
});
