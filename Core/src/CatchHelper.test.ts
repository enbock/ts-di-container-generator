import CatchHelper from './CatchHelper';

class TestError extends Error {
}

class OtherTestError extends Error {
}

class ThirdTestError extends Error {
}

describe('CatchHelper', function () {
    it('should assert special error and rethrow if wrong with native error', function () {
        function testException() {
            try {
                (null as any).replace('a', 'b');
            } catch (e) {
                CatchHelper.assert(e, TestError);
            }
        }

        expect(() => testException()).toThrowError();
    });

    it('should assert special error and do nothing if fine', function () {
        const testError: TestError = new TestError();

        function testException() {
            CatchHelper.assert(testError, TestError);
        }

        expect(() => testException()).not.toThrow();
    });

    it('should assert special error and rethrow if wrong', function () {
        const otherTestError: OtherTestError = new OtherTestError();

        function testException() {
            CatchHelper.assert(otherTestError, TestError);
        }

        expect(() => testException()).toThrow(otherTestError);
    });

    it('should assert multiple special errors and do nothing if fine', function () {

        function testException() {
            CatchHelper.assertMultiple(new TestError(), [TestError, OtherTestError]);
            CatchHelper.assertMultiple(new OtherTestError(), [TestError, OtherTestError]);
        }

        expect(() => testException()).not.toThrow();
    });

    it('should assert multiple special error and rethrow if wrong', function () {
        const error: ThirdTestError = new ThirdTestError();

        function testException() {
            CatchHelper.assertMultiple(error, [TestError, OtherTestError]);
        }

        expect(() => testException()).toThrow(error);
    });
});
