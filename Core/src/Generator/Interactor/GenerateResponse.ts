import {Statement} from 'typescript';

export default interface GenerateResponse {
    imports: Array<Statement>;
    statements: Array<Statement>;
}