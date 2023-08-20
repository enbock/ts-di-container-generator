import ConfigEntity from 'Core/Configuration/ConfigEntity';

export class ConfigMissing extends Error {
}

export default interface ConfigClient {
    loadConfig(): Promise<throwErrorOrReturn<ConfigMissing, ConfigEntity>>;
}