import {Spy} from 'jasmine-auto-spies';

export default function mock<T extends object>(obj?: any): Spy<T> {
    return buildStub(obj ?? {} as T) as Spy<T>;
}

function buildStub<T extends object>(target: T): T {
    return new Proxy<T>(target, {
        get: (obj: T, property: T[keyof T]): T[T[keyof T]] => {
            if (property in obj) {
                return obj[property];
            }
            (obj as any)[property] = () => undefined as never;
            return spyOn(obj, property) as T[T[keyof T]];
        }
    });
}