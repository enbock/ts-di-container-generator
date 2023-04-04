export default class CatchHelper {
    public static assert(error: any, className: any): void {
        if ((error instanceof className) === false) throw error;
    }

    public static assertMultiple(error: any, classNames: any[]): void {
        for (const className of classNames) {
            try {
                CatchHelper.assert(error, className);
                return;
            } catch (e) {
            }
        }
        throw error;
    }
}
