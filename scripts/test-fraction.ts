import { calculateTwoPhases } from '../src/lib/calculate';

console.log('=== TEST 1: جليل with Partial Selection [1, 2, 3] (Image 4) ===');
const rPartial = calculateTwoPhases('جليل', [1, 2, 3], { num: '80', den: '1' });
console.log('Phase 1 Total Sum:', rPartial.transferredPhase1SumDisplay); // 1928/45
console.log('Phase 1 Seed:', rPartial.seedGenerated); // 61
console.log('Phase 2 Step 3:', rPartial.iterations[1].step3Fractions.map(f => f.toString()));
console.log('Phase 2 Final Fractions:', rPartial.resultRows.map(r => `${r.char}: ${r.finalFractionDisplay}`));
console.log('Checked letters:', rPartial.transferredLetters);
console.log('Checked Sum:', rPartial.transferredSumDisplay); // 10160221/232324
console.log('Checked Sqrt:', `${rPartial.transferredSqrtResult.intPart}.${rPartial.transferredSqrtResult.first10AfterDot}`); // 6.6130916117
console.log('Final 10-digit sum:', rPartial.final10DigitSum); // 35
console.log('Final single digit:', rPartial.finalSingleDigit); // 8

console.log('\n=== TEST 2: جليل with Full Selection [0, 1, 2, 3] ===');
const rFull = calculateTwoPhases('جليل', [0, 1, 2, 3], { num: '80', den: '1' });
console.log('Checked Sum:', rFull.transferredSumDisplay); // 5080141/116162
console.log('Checked Sqrt:', `${rFull.transferredSqrtResult.intPart}.${rFull.transferredSqrtResult.first10AfterDot}`); // 6.6131114635
console.log('Final 10-digit sum:', rFull.final10DigitSum); // 31
console.log('Final single digit:', rFull.finalSingleDigit); // 4
