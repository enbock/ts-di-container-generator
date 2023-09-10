import NodeEntity from 'Core/File/NodeEntity';

export interface CodeRecord {
    [interfaceName: string]: NodeEntity;
}

export default class ManualCodeEntity {
    public manualCode: CodeRecord = {};
}