import { calculateTwoPhases } from '../src/lib/calculate';

console.log('--- TEST مدد WITH BASE 100 ---');
const r100 = calculateTwoPhases('مدد', [1, 2], { num: '100', den: '1' });
console.log('Seed generated:', r100.seedGenerated);
console.log('Phase 2 sum:', r100.transferredSumDisplay);
console.log('Phase 2 sqrt:', `${r100.transferredSqrtResult.intPart}.${r100.transferredSqrtResult.first10AfterDot}`);
console.log('Final 10-digit sum:', r100.final10DigitSum);
console.log('Final single digit:', r100.finalSingleDigit);

console.log('\n--- TEST جليل WITH BASE 80 ---');
const r80 = calculateTwoPhases('جليل', [1, 2, 3], { num: '80', den: '1' });
console.log('Seed generated:', r80.seedGenerated);
console.log('Phase 2 sum:', r80.transferredSumDisplay);
console.log('Phase 2 sqrt:', `${r80.transferredSqrtResult.intPart}.${r80.transferredSqrtResult.first10AfterDot}`);
console.log('Final 10-digit sum:', r80.final10DigitSum);
console.log('Final single digit:', r80.finalSingleDigit);
