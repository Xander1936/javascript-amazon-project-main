import { formatCurrency } from '../../scripts/utils/money.js';

// 1. Manual Tests -> By opening the Website in the Browser
// 2. Automated Tests = using code to test code
// https://github.com/jasmine/jasmine/releases

// How many test cases should we have ?
// 1. Basic test cases = tests if the code is working.
// 2. Edge test cases = test with values that are tricky.

// Test cases for formatCurrency
// Group related tests together; a group of related tests = test suite
console.log('Test suite: formatCurrency');

// Basic test cases
console.log('Converts cents into dollars');

if (formatCurrency(2095) === '20.95') {
    console.log('passed');
} else {
    console.log('failed');
}

// 2. Edge test cases because 0 is not positive or negative and 
console.log('Works with 0');

if (formatCurrency(0) === '0.00') {
    console.log('passed');
} else {
    console.log('failed');
}
// Up there we test 2 different situations = 2 different test cases
console.log('Rounds up to the nea rest cent');

if (formatCurrency(2000.5) === '20.01') {
    console.log('passed');
} else {
    console.log('failed');
}

if (formatCurrency(2000.4) === '20.00') {
    console.log('passed');
} else {
    console.log('failed');
}