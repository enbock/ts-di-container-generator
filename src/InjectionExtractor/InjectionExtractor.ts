import TypeScript, {Node, Program, SourceFile} from 'typescript';
import ParsingTask from './Task/ParsingTask';
import FileName from '../FileName';
import DescriptorEntity from '../DescriptorEntity';
import path from 'path';

export default class InjectionExtractor {
    constructor(
        private parserTasks: ParsingTask[],
        private resolve: typeof path.resolve
    ) {
    }

    public extract(basePath: string, file: FileName): DescriptorEntity {
        const filePath: string = this.resolve(basePath, file);
        console.log('Parse', filePath, '...');
        const result: DescriptorEntity = new DescriptorEntity(filePath);
        let program: Program = TypeScript.createProgram([filePath], {allowJs: true});
        const sourceFile: SourceFile | undefined = program.getSourceFile(filePath + '.ts');

        if (sourceFile === undefined) return result;

        TypeScript.forEachChild(sourceFile, (node: Node): void => {
            this.parserTasks.forEach((task: ParsingTask) => task.parse(node, result));
        });

        return result;
    }
}
