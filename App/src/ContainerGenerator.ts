import path from 'path';
import FileName from 'Core/File/FileName';
import DependencyInjectionContainer from './DependencyInjection/Container.dist';
import Controller from './Controller/Controller';

const RootDependency: Controller = DependencyInjectionContainer.controller;

async function main(source: string, mainFile: FileName, ignoreList: Array<FileName>): Promise<void> {
    const basePath: string = path.resolve(process.cwd(), source);

    console.time('Run time');
    await RootDependency.generate(basePath, mainFile, ignoreList);
    console.timeEnd('Run time');
}

const args: Array<string> = process.argv.map((e: string) => e);
args.shift();
args.shift();
main(args.shift() || '', args.shift() || '', args).then();
