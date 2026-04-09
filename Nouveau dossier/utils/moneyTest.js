import { formatCurrency } from '../../scripts/utils/money.js';

// 1. Manual Tests -> By opening the Website in the Browser
// 2. Automated Tests = using code to test code
// https://github.com/jasmine/jasmine/releases

// How many test cases should we have ?
// 1. Basic test cases = tests if the code is working.
// 2. Edge test cases = test with values that are tricky.

// Test cases for formatCurrency
// Group related tests together; a group of related tests = test suite
describe('test suite: formatCurrency', () => {
    it('converts cents into dollars', () => {
        expect(formatCurrency(2095)).toEqual('20.95');
    });

    it('works with 0', () => {
        expect(formatCurrency(0)).toEqual('0.00');
    });

    it('rounds up to the nearest cent', () => {
        expect(formatCurrency(2000.5)).toEqual('20.01');
    });
});