import FileCreator from './FileCreator';
import fs from 'fs';
import TypeScript, {ClassDeclaration, ClassElement, NodeArray, Statement, SyntaxKind} from 'typescript';
import ContainerObjectGenerator from './ContainerObjectGenerator';
import ContainerClassGenerator from './ContainerClassGenerator';
import StringHelper from '../StringHelper';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import MockedObject from '../MockedObject';
import SpyFn = jasmine.Spy;

describe('FileCreator', function () {
    let fileGenerator: FileCreator,
        statementGenerator: Spy<ContainerClassGenerator>,
        objectGenerator: Spy<ContainerObjectGenerator>,
        writeFile: SpyFn<typeof fs.promises.writeFile>
    ;

    beforeEach(function () {
        statementGenerator = createSpyFromClass(ContainerObjectGenerator);
        objectGenerator = createSpyFromClass(ContainerObjectGenerator);
        writeFile = jasmine.createSpy();

        fileGenerator = new FileCreator(
            new StringHelper(),
            statementGenerator,
            objectGenerator,
            writeFile
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

    it('should generate TypeScript file', function (): void {
        const testProperties: ClassElement[] = [createTestProperty()];
        objectGenerator.generate.and.returnValue(testProperties);
        statementGenerator.generate.and.returnValue(createTestStatements());

        fileGenerator.generate('test::descriptors:' as MockedObject, 'TODO', 'test::targetFile:');

        expect(objectGenerator.generate).toHaveBeenCalledWith('test::descriptors:');
        expect(writeFile).toHaveBeenCalledWith(
            'test::targetFile:',
            `class OutputClass {
    public testProperty: string = new TestClass();
}
`,
            {flag: 'w'}
        );
    });
});
