#!/usr/bin/env ts-node

import path from 'path';
import FileName from 'Core/FileName';
import Generator from './Generator';
import DependencyInjectionContainer from './DependencyInjection/Container.dist';

const RootDependency: Generator = DependencyInjectionContainer.generator;

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
