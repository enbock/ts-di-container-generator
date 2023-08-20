import FileName from 'Core/File/FileName';

export class PathAlias {
    public regExp: RegExp = /^$/;
    public targetPath: FileName = '';
    public name: string = '';
}

export default class ConfigEntity {
    public pathAliases: PathAlias[] = [];
    public basePath: FileName = '';
}