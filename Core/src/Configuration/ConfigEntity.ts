import FileName from 'Core/File/FileName';

export class PathAlias {
    public regExp: RegExp = /^$/;
    public targetPath: FileName = '';
}

export default class ConfigEntity {
    public pathAliases: PathAlias[] = [];
}