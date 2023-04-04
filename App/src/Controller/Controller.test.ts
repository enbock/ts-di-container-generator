import Controller from './Controller';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import MockedObject from 'Core/MockedObject';
import GeneratorInteractor from 'Core/Generator/Interactor/Interactor';
import Presenter from './Presenter';
import GenerateRequest from './GenerateRequest';
import GenerateResponse from './GenerateResponse';

describe('Controller', function (): void {
    let fileGenerator: Controller,
        generatorInteractor: Spy<GeneratorInteractor>,
        presenter: Spy<Presenter>
    ;

    beforeEach(function (): void {
        generatorInteractor = createSpyFromClass(GeneratorInteractor);
        presenter = createSpyFromClass(Presenter);

        fileGenerator = new Controller(
            generatorInteractor,
            presenter
        );
    });

    it('should generate TypeScript file', function (): void {
        let generateResponse: GenerateResponse = new GenerateResponse();
        generatorInteractor.generate.and.callFake(
            function (request: GenerateRequest, response: GenerateResponse): void {
                generateResponse = response;
                generateResponse.statements = 'test::statements:' as MockedObject;
                expect(request.basePath).toBe('test::basePath:');
                expect(request.descriptors).toBe('test::descriptors:' as MockedObject);
                expect(request.targetFile).toBe('test::targetFile:');
            }
        );

        fileGenerator.generate('test::descriptors:' as MockedObject, 'test::basePath:', 'test::targetFile:');

        expect(generatorInteractor.generate).toHaveBeenCalled();
        expect(presenter.present).toHaveBeenCalledWith(generateResponse, 'test::targetFile:');
    });
});
