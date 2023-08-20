import ConfigResponse from 'Core/Configuration/LanguageConfigUseCase/ConfigResponse';
import ConfigClient from 'Core/Configuration/ConfigClient';

export default class LanguageConfigUseCase {
    constructor(
        private configClient: ConfigClient
    ) {
    }

    public async getConfig(response: ConfigResponse): Promise<void> {
        response.config = await this.configClient.loadConfig();
    }
}