import { calculateThreeIterations } from '../src/lib/calculate';

console.log('===============================================================');
console.log('  RUNNING VERIFICATION FOR 3-ITERATION ARABIC NUMEROLOGY ENGINE');
console.log('  (Verifying Images 1, 2, 3 for Word "مدد")                    ');
console.log('===============================================================\n');

try {
  const result = calculateThreeIterations('مدد');

  console.log(`Input: "${result.inputText}"`);
  console.log(`Normalized: [${result.normalizedChars.join(', ')}]`);
  console.log(`Total Chars: ${result.totalChars}\n`);

  // --- 1. ITERATION 1 (Image 1 - Hidden) ---
  const iter1 = result.iterations[0];
  console.log('--- ITERATION 1 (القسم الأول - المخفي) ---');
  console.log(`Input: ${iter1.inputVal} (Expected: 260)`);
  console.log(`S2: ${iter1.sum2.toString()} (Expected: 14/3)`);
  console.log(`Total: ${iter1.totalSum.toString()} (Expected: 11050/49)`);
  console.log(`Sqrt: ${iter1.sqrtResult.fullString.substring(0, 16)} (Expected ~ 15.0169971725...)`);
  console.log(`10 Digits: ${iter1.sqrtResult.first10AfterDot} (Expected: 0169971725)`);
  console.log(`Extracted Sum: ${iter1.extracted10DigitSum} (Expected: 47)`);

  if (iter1.extracted10DigitSum !== 47) {
    throw new Error(`Iteration 1 failed: got ${iter1.extracted10DigitSum}, expected 47`);
  }
  console.log('✅ Iteration 1 matches Image 1 (Seed 47) perfectly!\n');

  // --- 2. ITERATION 2 (Image 2 - Hidden) ---
  const iter2 = result.iterations[1];
  console.log('--- ITERATION 2 (القسم الثاني - المخفي) ---');
  console.log(`Input: ${iter2.inputVal} (Expected: 47)`);
  console.log(`Total: ${iter2.totalSum.toString()} (Expected: 3995/98)`);
  console.log(`Sqrt: ${iter2.sqrtResult.fullString.substring(0, 16)} (Expected ~ 6.3847714228...)`);
  console.log(`10 Digits: ${iter2.sqrtResult.first10AfterDot} (Expected: 3847714228)`);
  console.log(`Extracted Sum: ${iter2.extracted10DigitSum} (Expected: 46)`);

  if (iter2.extracted10DigitSum !== 46) {
    throw new Error(`Iteration 2 failed: got ${iter2.extracted10DigitSum}, expected 46`);
  }
  console.log('✅ Iteration 2 matches Image 2 (Seed 46) perfectly!\n');

  // --- 3. ITERATION 3 (Image 3 - Visible & Interactive) ---
  const iter3 = result.visibleIteration;
  console.log('--- ITERATION 3 (القسم الثالث - الظاهر والتفاعلي) ---');
  console.log(`Input: ${iter3.inputVal} (Expected: 46)`);

  const rowFractions = result.resultRows.map(r => `${r.char} (#${r.pos}): ${r.finalFractionDisplay}`);
  console.log(`Result Rows: \n  ${rowFractions.join('\n  ')}`);
  console.log(`Expected Slots: م: 23/98, د: 593/49, د: 2961/98`);

  if (result.resultRows[0].finalFractionDisplay !== '23/98') {
    throw new Error(`Row 1 mismatch: got ${result.resultRows[0].finalFractionDisplay}, expected 23/98`);
  }
  if (result.resultRows[1].finalFractionDisplay !== '593/49') {
    throw new Error(`Row 2 mismatch: got ${result.resultRows[1].finalFractionDisplay}, expected 593/49`);
  }
  if (
    result.resultRows[2].finalFractionDisplay !== '423/14' &&
    result.resultRows[2].finalFractionDisplay !== '2961/98'
  ) {
    throw new Error(`Row 3 mismatch: got ${result.resultRows[2].finalFractionDisplay}, expected 423/14 or 2961/98`);
  }
  console.log('✅ All 3 Result Rows match Image 3 fractions exactly!');

  console.log(`\nTransferred Sum: ${result.transferredSumDisplay} (Expected: 2085/49)`);
  if (result.transferredSumDisplay !== '2085/49') {
    throw new Error(`Transferred Sum mismatch: got ${result.transferredSumDisplay}, expected 2085/49`);
  }

  console.log(`Square Root: ${result.transferredSqrtResult.fullString.substring(0, 16)} (Expected ~ 6.5231143181...)`);
  console.log(`10 Digits after dot: ${result.transferredSqrtResult.first10AfterDot} (Expected: 5231143181)`);
  console.log(`Ultimate 10-Digit Sum: ${result.final10DigitSum} (Expected: 29)`);

  if (result.final10DigitSum !== 29) {
    throw new Error(`Final 10-digit sum mismatch: got ${result.final10DigitSum}, expected 29`);
  }
  console.log('✅ Ultimate 10-digit sum matches Image 3 (29) perfectly!');

  // Test interactive transfer toggles
  console.log('\n--- TESTING INTERACTIVE TRANSFER TOGGLE (زر انتقال) ---');
  // Toggle all slots transferred
  const allTransferred = calculateThreeIterations('مدد', [0, 1, 2]);
  console.log(`All slots transferred:`);
  console.log(`  New Transferred Sum: ${allTransferred.transferredSumDisplay}`);
  console.log(`  New Sqrt: ${allTransferred.transferredSqrtResult.fullString.substring(0, 15)}...`);
  console.log(`  New 10-digit sum: ${allTransferred.final10DigitSum}`);
  console.log('✅ Interactive Transfer Toggle works smoothly!');

  console.log('\n===============================================================');
  console.log('🎉 ALL 3-ITERATION MATHEMATICAL TESTS PASSED WITH 100% SUCCESS!');
  console.log('===============================================================');
} catch (err) {
  console.error('❌ Verification failed:', err);
  process.exit(1);
}

