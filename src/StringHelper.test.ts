import StringHelper from './StringHelper';

describe('StringHelper', function (): void {
    let helper: StringHelper;

    beforeEach(function () {
        helper = new StringHelper();
    });

    it('should convert parts to camel case', function (): void {
        expect(helper.toCamelCase('one', 'two')).toBe('oneTwo');
    });

    it('should convert to pascal case', function (): void {
        expect(helper.toFirstUpper('word')).toBe('Word');
    });

    it('should convert to camel case', function (): void {
        expect(helper.toFirstLower('Word')).toBe('word');
    });
});
