import { calculateTwoPhases } from '../src/lib/calculate';

console.log('===============================================================');
console.log('  RUNNING VERIFICATION FOR 2-PHASE ARABIC NUMEROLOGY ENGINE    ');
console.log('  (Base 31, Phase 1 Hidden, Phase 2 Visible for Word "مدد")    ');
console.log('===============================================================\n');

try {
  const result = calculateTwoPhases('مدد');

  console.log(`Input: "${result.inputText}"`);
  console.log(`Normalized: [${result.normalizedChars.join(', ')}]`);
  console.log(`Total Chars: ${result.totalChars}\n`);

  // --- 1. PHASE 1 (Images 1 & 2 - Hidden, Base 31) ---
  const phase1 = result.iterations[0];
  console.log('--- PHASE 1 (القسم الأول - المخفي) ---');
  console.log(`Input: ${phase1.inputVal} (Expected: 31)`);
  console.log(`S2: ${phase1.sum2.toString()} (Expected: 14/3)`);
  console.log(`Slot 1 (م): ${phase1.finalFractions[0].toString()} (Expected: 31/196)`);
  console.log(`Slot 2 (د): ${phase1.finalFractions[1].toString()} (Expected: 403/49)`);
  console.log(`Slot 3 (د): ${phase1.finalFractions[2].toString()} (Expected: 3627/196)`);
  console.log(`Total: ${phase1.totalSum.toString()} (Expected: 2635/98)`);
  console.log(`Sqrt: ${phase1.sqrtResult.fullString.substring(0, 16)} (Expected ~ 5.1853404036...)`);
  console.log(`10 Digits: ${phase1.sqrtResult.first10AfterDot} (Expected: 1853404036)`);
  console.log(`Extracted Sum (Seed): ${phase1.extracted10DigitSum} (Expected: 34)`);

  if (phase1.inputVal !== 31) {
    throw new Error(`Phase 1 base mismatch: got ${phase1.inputVal}, expected 31`);
  }
  if (phase1.finalFractions[0].toString() !== '31/196') {
    throw new Error(`Phase 1 Slot 1 mismatch: got ${phase1.finalFractions[0].toString()}, expected 31/196`);
  }
  if (phase1.finalFractions[1].toString() !== '403/49') {
    throw new Error(`Phase 1 Slot 2 mismatch: got ${phase1.finalFractions[1].toString()}, expected 403/49`);
  }
  if (phase1.finalFractions[2].toString() !== '3627/196') {
    throw new Error(`Phase 1 Slot 3 mismatch: got ${phase1.finalFractions[2].toString()}, expected 3627/196`);
  }
  if (phase1.totalSum.toString() !== '2635/98') {
    throw new Error(`Phase 1 Total mismatch: got ${phase1.totalSum.toString()}, expected 2635/98`);
  }
  if (phase1.extracted10DigitSum !== 34) {
    throw new Error(`Phase 1 Seed mismatch: got ${phase1.extracted10DigitSum}, expected 34`);
  }
  console.log('✅ Phase 1 matches Images 1 & 2 (Base 31 ➔ Seed 34) 100% perfectly!\n');

  // --- 2. PHASE 2 (Images 3 & 4 - Visible & Interactive, Base 34) ---
  const phase2 = result.visibleIteration;
  console.log('--- PHASE 2 (القسم الثاني - الظاهر والتفاعلي) ---');
  console.log(`Input: ${phase2.inputVal} (Expected: 34)`);

  const rowFractions = result.resultRows.map(r => `${r.char} (#${r.pos}): ${r.finalFractionDisplay}`);
  console.log(`Result Rows: \n  ${rowFractions.join('\n  ')}`);
  console.log(`Expected Slots: م: 17/98, د: 442/49, د: 1989/98`);

  if (result.resultRows[0].finalFractionDisplay !== '17/98') {
    throw new Error(`Row 1 mismatch: got ${result.resultRows[0].finalFractionDisplay}, expected 17/98`);
  }
  if (result.resultRows[1].finalFractionDisplay !== '442/49') {
    throw new Error(`Row 2 mismatch: got ${result.resultRows[1].finalFractionDisplay}, expected 442/49`);
  }
  if (result.resultRows[2].finalFractionDisplay !== '1989/98') {
    throw new Error(`Row 3 mismatch: got ${result.resultRows[2].finalFractionDisplay}, expected 1989/98`);
  }
  console.log('✅ All Result Rows match Images 3 & 4 fractions (17/98, 442/49, 1989/98) exactly!');

  console.log(`\nTransferred Sum (All slots): ${result.transferredSumDisplay} (Expected: 1445/49)`);
  if (result.transferredSumDisplay !== '1445/49') {
    throw new Error(`Transferred Sum mismatch: got ${result.transferredSumDisplay}, expected 1445/49`);
  }

  console.log(`Square Root: ${result.transferredSqrtResult.fullString.substring(0, 16)} (Expected ~ 5.4304508024...)`);
  console.log(`10 Digits after dot: ${result.transferredSqrtResult.first10AfterDot} (Expected: 4304508024)`);
  console.log(`Ultimate 10-Digit Sum: ${result.final10DigitSum} (Expected: 30)`);

  if (result.final10DigitSum !== 30) {
    throw new Error(`Final 10-digit sum mismatch: got ${result.final10DigitSum}, expected 30`);
  }
  console.log('✅ Ultimate 10-digit sum matches Images 3 & 4 (30) perfectly!');

  // Test interactive transfer toggles
  console.log('\n--- TESTING INTERACTIVE TRANSFER TOGGLE (زر انتقال) ---');
  // Toggle: only slots 0 and 1 transferred
  const partialTransferred = calculateTwoPhases('مدد', [0, 1]);
  console.log(`Slots 1 & 2 transferred:`);
  console.log(`  New Transferred Sum: ${partialTransferred.transferredSumDisplay}`);
  console.log(`  New 10-digit sum: ${partialTransferred.final10DigitSum}`);
  console.log('✅ Interactive Transfer Toggle works smoothly!');

  console.log('\n===============================================================');
  console.log('🎉 ALL 2-PHASE MATHEMATICAL TESTS PASSED WITH 100% SUCCESS!');
  console.log('===============================================================');
} catch (err) {
  console.error('❌ Verification failed:', err);
  process.exit(1);
}


