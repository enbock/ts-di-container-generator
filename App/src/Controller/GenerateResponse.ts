import GenerateResponseInterface from 'Core/Generator/Interactor/GenerateResponse';
import {Statement} from 'typescript';

export default class GenerateResponse implements GenerateResponseInterface {
    constructor(
        public statements: Array<Statement> = []
    ) {
    }
}