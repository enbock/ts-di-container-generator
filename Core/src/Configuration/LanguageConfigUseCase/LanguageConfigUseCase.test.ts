import LanguageConfigUseCase from './LanguageConfigUseCase';
import {Spy} from 'jasmine-auto-spies';
import ConfigClient from 'Core/Configuration/ConfigClient';
import ConfigEntity from 'Core/Configuration/ConfigEntity';
import ConfigResponse from 'Core/Configuration/LanguageConfigUseCase/ConfigResponse';
import MockedObject from 'Core/MockedObject';
import mock from 'Core/mock';

describe('LanguageConfigUseCase', function (): void {
    let useCase: LanguageConfigUseCase,
        configClient: Spy<ConfigClient>
    ;

    beforeEach(function (): void {
        configClient = mock<ConfigClient>();

        useCase = new LanguageConfigUseCase(
            configClient
        );
    });

    it('should load config', async function (): Promise<void> {
        configClient.loadConfig.and.returnValue('test::config');

        const response: ConfigResponse = {config: new ConfigEntity()};

        await useCase.getConfig(response);

        expect(configClient.loadConfig).toHaveBeenCalled();
        expect(response.config).toBe('test::config' as MockedObject);
    });
});