import GenerateResponseInterface from 'Core/Generator/Interactor/GenerateResponse';
import {Statement} from 'typescript';

export default class GenerateResponse implements GenerateResponseInterface {
    public statements: Array<Statement> = [];
    public imports: Array<Statement> = [];
}