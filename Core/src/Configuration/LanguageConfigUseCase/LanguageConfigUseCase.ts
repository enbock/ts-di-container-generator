import ConfigResponse from 'Core/Configuration/LanguageConfigUseCase/ConfigResponse';
import ConfigClient, {ConfigMissing} from 'Core/Configuration/ConfigClient';
import CatchHelper from 'Core/CatchHelper';
import ConfigEntity from 'Core/Configuration/ConfigEntity';

export default class LanguageConfigUseCase {
    constructor(
        private configClient: ConfigClient
    ) {
    }

    public async getConfig(response: ConfigResponse): Promise<void> {
        try {
            response.config = await this.configClient.loadConfig();
        } catch (error) {
            CatchHelper.assert(error, ConfigMissing);
            response.config = new ConfigEntity();
        }
    }
}