import FileName from './File/FileName';

export type AliasName = string;

export enum Type {
    INTERFACE,
    CLASS
}

export class AliasEntity {
    constructor(
        public name: AliasName = '',
        public origin: string = ''
    ) {
    }

    public toString(): string {
        return '[Alias: ' + (this.origin ? this.origin + ' as ' : '') + this.name + ']';
    }
}

export class InterfaceEntity {
    public type: Type = Type.INTERFACE;

    constructor(
        public name: string
    ) {
    }

    public toString(): string {
        return '[Interface: ' + this.name + ']';
    }
}

export class ClassEntity {
    public type: Type = Type.CLASS;

    constructor(
        public name: string
    ) {
    }

    public toString(): string {
        return '[Class: ' + this.name + ']';
    }
}

export class RequirementEntity {
    public import: ImportEntity = new ImportEntity();

    constructor(
        public parameter: string,
        public type: AliasName = '',
        public isLinked: boolean = false
    ) {
    }

    public toString(): string {
        return '[Require: ' + this.parameter + ':' + this.type + ' from ' + this.import + ']';
    }
}

export class ImportEntity {
    constructor(
        public file: FileName = '',
        public alias: AliasEntity = new AliasEntity()
    ) {
    }

    public toString(): string {
        return '[Import: ' + this.alias.toString() + ' from ' + this.file + ']';
    }
}

export default class DescriptorEntity {
    public imports: Array<ImportEntity> = [];
    public requires: Map<AliasName, Array<RequirementEntity>> = new Map<AliasName, Array<RequirementEntity>>();
    public provides: Array<InterfaceEntity | ClassEntity> = [];

    constructor(
        public file: FileName
    ) {
    }

    public toString(): string {
        const requires: Array<string> = [];
        this.requires.forEach((r, name): void => {
            requires.push(name + ' needs [\n      ' + r.join(',\n      ') + '\n    ]\n');
        });
        return '[Descriptor:' +
            '\n  File:' + this.file +
            '\n  Imports:\n    ' + this.imports.join(',\n    ') +
            '\n  Requires:\n    ' + requires.join(',\n    ') +
            '\n  Provides:\n    ' + this.provides.join(', ')
            + '\n]';
    }
}
