export default class StringHelper {
    public toCamelCase(...list: string[]): string {
        const words: string[] = list.map(
            (s: string, index: number): string => index == 0 ? this.toFirstLower(s) : this.toFirstUpper(s)
        );
        return words.join('');
    }

    public toPascalCase(...list: string[]): string {
        const words: string[] = list.map(
            (s: string): string => this.toFirstUpper(s)
        );
        return words.join('');
    }

    public toFirstUpper(value: string): string {
        const char: string = value.substring(0, 1);
        return char.toUpperCase() + value.substring(1);
    }

    public toFirstLower(value: string): string {
        const char: string = value.substring(0, 1);
        return char.toLowerCase() + value.substring(1);
    }
}
