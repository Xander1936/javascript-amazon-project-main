import { formatCurrency } from "../scripts/utils/money.js";

// Create our first test suite using Jasmine
describe('test suite: formatCurrency', () => {
    // First Test
    it('converts cents into dollars', () => {
        expect(formatCurrency(2095)).toEqual('20.95');
    });
    // Second Test
    it('works with 0', () => {
        expect(formatCurrency(0)).toEqual('0.00');
    });
    // Third Test
    it('rounds up to the nearest cent', () => {
        expect(formatCurrency(2000.5)).toEqual('20.01');
    })
});