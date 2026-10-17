import { calculateTwoPhases } from '../src/lib/calculate';

console.log('Testing custom fraction ratio:');

// Test 54/2
const r1 = calculateTwoPhases('ادد', undefined, { num: '54', den: '2' });
console.log('--- 54/2 ---');
console.log('Phase 1 inputVal:', r1.iterations[0].inputVal);
console.log('Phase 1 inputDisplay:', r1.iterations[0].inputDisplay);
console.log('Phase 1 seed:', r1.iterations[0].extracted10DigitSum);
console.log('Phase 2 inputVal:', r1.iterations[1].inputVal);
console.log('Final sum:', r1.final10DigitSum);

// Test 2562/1
const r2 = calculateTwoPhases('ادد', undefined, { num: '2562', den: '1' });
console.log('--- 2562/1 ---');
console.log('Phase 1 inputVal:', r2.iterations[0].inputVal);
console.log('Phase 1 inputDisplay:', r2.iterations[0].inputDisplay);
console.log('Phase 1 seed:', r2.iterations[0].extracted10DigitSum);
console.log('Phase 2 inputVal:', r2.iterations[1].inputVal);
console.log('Final sum:', r2.final10DigitSum);
