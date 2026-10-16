import { calculateTwoPhases, BASE_VALUE } from '../src/lib/calculate';

console.log('===============================================================');
console.log('  RUNNING VERIFICATION FOR 2-PHASE ARABIC NUMEROLOGY ENGINE    ');
console.log('  (Base 5329, Phase 1 Hidden, Phase 2 Visible for Word "ادد")  ');
console.log('===============================================================\n');

try {
  const result = calculateTwoPhases('ادد');

  console.log(`Base Value: ${BASE_VALUE} (Expected: 5329)`);
  if (BASE_VALUE !== 5329) {
    throw new Error(`BASE_VALUE mismatch: got ${BASE_VALUE}, expected 5329`);
  }

  console.log(`Input: "${result.inputText}"`);
  console.log(`Normalized: [${result.normalizedChars.join(', ')}]`);
  console.log(`Total Chars: ${result.totalChars}\n`);

  // --- 1. PHASE 1 (Images 1 & 2 - Hidden, Base 5329) ---
  const phase1 = result.iterations[0];
  console.log('--- PHASE 1 (القسم الأول - المخفي) ---');
  console.log(`Input: ${phase1.inputVal} (Expected: 5329)`);
  console.log(`S2: ${phase1.sum2.toString()} (Expected: 14/3)`);
  console.log(`Slot 1 (ا): ${phase1.finalFractions[0].toString()} (Expected: 5329/196)`);
  console.log(`Slot 2 (د): ${phase1.finalFractions[1].toString()} (Expected: 69277/49)`);
  console.log(`Slot 3 (د): ${phase1.finalFractions[2].toString()} (Expected: 623493/196)`);
  console.log(`Total: ${phase1.totalSum.toString()} (Expected: 452965/98)`);
  console.log(`Sqrt: ${phase1.sqrtResult.fullString.substring(0, 16)} (Expected ~ 67.9859679399...)`);
  console.log(`10 Digits: ${phase1.sqrtResult.first10AfterDot} (Expected: 9859679399)`);
  console.log(`Extracted Sum (Seed): ${phase1.extracted10DigitSum} (Expected: 74)`);

  if (phase1.inputVal !== 5329) {
    throw new Error(`Phase 1 base mismatch: got ${phase1.inputVal}, expected 5329`);
  }
  if (phase1.sum2.toString() !== '14/3') {
    throw new Error(`Phase 1 S2 mismatch: got ${phase1.sum2.toString()}, expected 14/3`);
  }
  if (phase1.finalFractions[0].toString() !== '5329/196') {
    throw new Error(`Phase 1 Slot 1 mismatch: got ${phase1.finalFractions[0].toString()}, expected 5329/196`);
  }
  if (phase1.finalFractions[1].toString() !== '69277/49') {
    throw new Error(`Phase 1 Slot 2 mismatch: got ${phase1.finalFractions[1].toString()}, expected 69277/49`);
  }
  if (phase1.finalFractions[2].toString() !== '623493/196') {
    throw new Error(`Phase 1 Slot 3 mismatch: got ${phase1.finalFractions[2].toString()}, expected 623493/196`);
  }
  if (phase1.totalSum.toString() !== '452965/98') {
    throw new Error(`Phase 1 Total mismatch: got ${phase1.totalSum.toString()}, expected 452965/98`);
  }
  if (phase1.sqrtResult.first10AfterDot !== '9859679399') {
    throw new Error(`Phase 1 10-digits mismatch: got ${phase1.sqrtResult.first10AfterDot}, expected 9859679399`);
  }
  if (phase1.extracted10DigitSum !== 74) {
    throw new Error(`Phase 1 Seed mismatch: got ${phase1.extracted10DigitSum}, expected 74`);
  }
  console.log('✅ Phase 1 matches Images 1 & 2 (Base 5329 ➔ Seed 74) 100% perfectly!\n');

  // --- 2. PHASE 2 (Images 3 & 4 - Visible & Interactive, Base 74) ---
  const phase2 = result.visibleIteration;
  console.log('--- PHASE 2 (القسم الثاني - الظاهر والتفاعلي) ---');
  console.log(`Input: ${phase2.inputVal} (Expected: 74)`);

  const rowFractions = result.resultRows.map(r => `${r.char} (#${r.pos}): ${r.finalFractionDisplay}`);
  console.log(`Result Rows: \n  ${rowFractions.join('\n  ')}`);
  console.log(`Expected Slots: ا: 37/98, د: 962/49, د: 4329/98`);

  if (result.resultRows[0].finalFractionDisplay !== '37/98') {
    throw new Error(`Row 1 mismatch: got ${result.resultRows[0].finalFractionDisplay}, expected 37/98`);
  }
  if (result.resultRows[1].finalFractionDisplay !== '962/49') {
    throw new Error(`Row 2 mismatch: got ${result.resultRows[1].finalFractionDisplay}, expected 962/49`);
  }
  if (result.resultRows[2].finalFractionDisplay !== '4329/98') {
    throw new Error(`Row 3 mismatch: got ${result.resultRows[2].finalFractionDisplay}, expected 4329/98`);
  }
  console.log('✅ All Result Rows match Images 3 & 4 fractions (37/98, 962/49, 4329/98) exactly!');

  console.log(`\nTransferred Sum (All slots): ${result.transferredSumDisplay} (Expected: 3145/49)`);
  if (result.transferredSumDisplay !== '3145/49') {
    throw new Error(`Transferred Sum mismatch: got ${result.transferredSumDisplay}, expected 3145/49`);
  }

  console.log(`Square Root: ${result.transferredSqrtResult.fullString.substring(0, 16)} (Expected ~ 8.0114713673...)`);
  console.log(`10 Digits after dot: ${result.transferredSqrtResult.first10AfterDot} (Expected: 0114713673)`);
  console.log(`Ultimate 10-Digit Sum: ${result.final10DigitSum} (Expected: 33)`);

  if (result.transferredSqrtResult.first10AfterDot !== '0114713673') {
    throw new Error(`Final 10 digits mismatch: got ${result.transferredSqrtResult.first10AfterDot}, expected 0114713673`);
  }
  if (result.final10DigitSum !== 33) {
    throw new Error(`Final 10-digit sum mismatch: got ${result.final10DigitSum}, expected 33`);
  }
  console.log('✅ Ultimate 10-digit sum matches Images 3 & 4 (33) perfectly!');

  // Test interactive transfer toggles
  console.log('\n--- TESTING INTERACTIVE TRANSFER TOGGLE (زر انتقال) ---');
  // Toggle: only slot 0 transferred
  const partialTransferred = calculateTwoPhases('ادد', [0]);
  console.log(`Slot 1 (ا) transferred only:`);
  console.log(`  Transferred Sum: ${partialTransferred.transferredSumDisplay} (Expected: 37/98)`);
  if (partialTransferred.transferredSumDisplay !== '37/98') {
    throw new Error(`Partial transfer mismatch: got ${partialTransferred.transferredSumDisplay}, expected 37/98`);
  }
  console.log('✅ Interactive Transfer Toggle works smoothly!');

  console.log('\n===============================================================');
  console.log('🎉 ALL 2-PHASE MATHEMATICAL TESTS PASSED WITH 100% SUCCESS!');
  console.log('===============================================================');
} catch (err) {
  console.error('❌ Verification failed:', err);
  process.exit(1);
}
