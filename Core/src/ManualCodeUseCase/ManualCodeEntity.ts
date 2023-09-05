import InterfaceNodeEntity from 'Core/File/InterfaceNodeEntity';

export interface CodeRecord {
    [interfaceName: string]: InterfaceNodeEntity;
}

export default class ManualCodeEntity {
    public manualCode: CodeRecord = {};
}