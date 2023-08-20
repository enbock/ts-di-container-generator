import ConfigClient, {ConfigMissing} from 'Core/Configuration/ConfigClient';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import fs from 'fs';
import fsPromises from 'fs/promises';
import Parser from 'Infrastructure/Config/Parser';

export default class TypeScript implements ConfigClient {
    constructor(
        private fileExists: typeof fs.existsSync,
        private readFile: typeof fsPromises.readFile,
        private parser: Parser
    ) {
    }

    public async loadConfig(): Promise<throwErrorOrReturn<ConfigMissing, ConfigEntity>> {
        const data: object = await this.tryLoadFile('tsconfig.json');
        return await this.parser.parseConfig(data);
    }

    private async tryLoadFile(filePath: string): Promise<object> {
        if (this.fileExists(filePath) == false) throw new ConfigMissing();
        try {
            const data: string = await this.readFile(filePath, {encoding: 'utf-8'});
            return JSON.parse(data);
        } catch (error) {
            throw new ConfigMissing();
        }
    }
}