/**
 * 2-Phase Arabic Arbitrary-Precision Numerology Calculation Engine
 * المحرك الحسابي الدقيق للغة العربية عبر قسمين متتابعين (بدون تقريب)
 * - القسم الأول (المخفي): الأساس 5329 ➔ استخراج البذرة
 * - القسم الثاني (الظاهر): الأساس البذرة المستخرجة ➔ عرض جدول الحروف والكسور مع أزرار الانتقال التفاعلية
 */

import { Fraction, DecimalSquareRootResult, ONE, HUNDRED } from './fractionMath';
import { normalizeArabicText, normalizeChar } from './rules';
import {
  IterationSummary,
  ResultRowItem,
  TwoPhaseCalculationResult,
  ThreeIterationCalculationResult,
} from '../types/math';

export { normalizeChar };
export type {
  IterationSummary,
  ResultRowItem,
  TwoPhaseCalculationResult,
  ThreeIterationCalculationResult,
};

// Aliases for backwards compatibility
export type CalculationState = TwoPhaseCalculationResult;
export type DualPhaseResult = TwoPhaseCalculationResult;
export type FourIterationCalculationResult = TwoPhaseCalculationResult;

export const BASE_VALUE = 5329;

const ITERATION_NAMES = [
  'القسم الأول (المخفي)',
  'القسم الثاني (الظاهر)',
];

/**
 * Execute a single phase/iteration of the 6-step Arabic fraction algorithm
 * @param chars - Normalized characters array
 * @param inputVal - The input number (5329 for phase 1, previous 10-digit sum seed for phase 2)
 * @param iterationIndex - 1 or 2
 */
export function executeSingleIteration(
  chars: string[],
  inputVal: number,
  iterationIndex: number
): IterationSummary {
  const n = chars.length;
  if (n === 0) {
    throw new Error('قائمة الحروف فارغة');
  }

  // 1. الخطوة 1: قيمة المدخل الإجمالية
  const sum1 = new Fraction(BigInt(inputVal), ONE);

  // 2. الخطوة 2: عدد طبيعي (i ÷ n) × i = i^2 / n
  const step2Fractions = chars.map((_, i) => {
    const idx = BigInt(i + 1);
    return new Fraction(idx * idx, BigInt(n));
  });
  let sum2 = new Fraction(0n, ONE);
  step2Fractions.forEach(f => {
    sum2 = sum2.add(f);
  });

  // 3. الخطوة 3: (قيمة خطوة 2 ÷ S2) × المدخل الإجمالي
  const step3Fractions = step2Fractions.map(v2 => v2.div(sum2).mul(sum1));
  const v3_last = step3Fractions[n - 1];

  // 4. الخطوة 4: جمع طبيعي لنواتج خطوة 3 للأحرف المتماثلة
  const charGroups: Record<string, Fraction> = {};
  chars.forEach((c, idx) => {
    const v3 = step3Fractions[idx];
    charGroups[c] = charGroups[c] ? charGroups[c].add(v3) : v3;
  });

  // 5. الخطوة 5: (قيمة خطوة 3 ÷ آخر خانة من خطوة 3) × 100
  const step5Fractions = step3Fractions.map(v3 => {
    if (v3_last.isZero()) return new Fraction(0n, ONE);
    return v3.div(v3_last).mul(new Fraction(HUNDRED, ONE));
  });
  let sum5 = new Fraction(0n, ONE);
  step5Fractions.forEach(f => {
    sum5 = sum5.add(f);
  });

  // 6. الخطوة 6: النسب المئوية وضربها بقيم الحروف من خطوة 4
  const step6RatioFractions = step5Fractions.map(v5 => {
    if (sum5.isZero()) return new Fraction(0n, ONE);
    return v5.div(sum5).mul(new Fraction(HUNDRED, ONE));
  });

  const finalFractions = chars.map((c, idx) => {
    const charGroupVal = charGroups[c];
    const ratio = step6RatioFractions[idx];
    return charGroupVal.mul(ratio).div(new Fraction(HUNDRED, ONE));
  });

  // الناتج الإجمالي للدورة: جمع الخانات النهائية
  let totalSum = new Fraction(0n, ONE);
  finalFractions.forEach(f => {
    totalSum = totalSum.add(f);
  });

  // جذر المجموع واستخراج أول 10 أرقام بعد الفاصلة
  const sqrtResult = totalSum.sqrtDecimal(60);
  const extracted10DigitSum =
    sqrtResult.unsimplifiedSum > 0 ? sqrtResult.unsimplifiedSum : 1;

  return {
    iterationIndex,
    name: ITERATION_NAMES[iterationIndex - 1] || `القسم ${iterationIndex}`,
    isBackground: iterationIndex === 1,
    inputVal,
    sum1,
    sum2,
    step2Fractions,
    step3Fractions,
    charGroups,
    step5Fractions,
    sum5,
    step6RatioFractions,
    finalFractions,
    totalSum,
    sqrtResult,
    extracted10DigitSum,
  };
}

/**
 * Execute the Full 2-Phase Calculation Engine for Arabic Text
 * @param text - The input Arabic text
 * @param transferredIndices - Indices of slots transferred in Phase 2
 */
export function calculateTwoPhases(
  text: string,
  transferredIndices?: number[]
): TwoPhaseCalculationResult {
  const { rawChars, normalizedChars } = normalizeArabicText(text);
  const n = normalizedChars.length;

  if (n === 0) {
    throw new Error('يرجى إدخال نص عربي صحيح يحتوي على حروف قابلة للتحليل');
  }

  // --- القسم الأول (المخفي): الأساس 5329 كقاعدة استخراجية ---
  const iter1 = executeSingleIteration(normalizedChars, BASE_VALUE, 1);

  // --- القسم الثاني (الظاهر): الأساس البذرة المستخرجة من القسم الأول ---
  const iter2 = executeSingleIteration(normalizedChars, iter1.extracted10DigitSum, 2);

  // تحديد الخانات المنتقلة (افتراضياً الكل محدد)
  const activeSelected =
    transferredIndices !== undefined
      ? transferredIndices
      : normalizedChars.map((_, i) => i);

  // بناء الأسطر لجدول القسم الثاني الظاهر (Result Rows)
  const resultRows: ResultRowItem[] = normalizedChars.map((char, idx) => {
    const finalFrac = iter2.finalFractions[idx];
    const isTransferred = activeSelected.includes(idx);
    return {
      pos: idx + 1,
      char,
      originalChar: rawChars[idx] || char,
      finalFraction: finalFrac,
      finalFractionDisplay: finalFrac.toString(),
      isTransferred,
    };
  });

  // حساب مجموع الخانات المنتقلة
  const transferredRows = resultRows.filter(r => r.isTransferred);
  let transferredSum = new Fraction(0n, ONE);
  transferredRows.forEach(r => {
    transferredSum = transferredSum.add(r.finalFraction);
  });

  // حساب الجذر التربيعي لمجموع الخانات المنتقلة
  let transferredSqrtResult: DecimalSquareRootResult;
  if (transferredSum.isZero()) {
    transferredSqrtResult = {
      intPart: '0',
      fracPart: '0'.repeat(60),
      fullString: '0.' + '0'.repeat(60),
      first10AfterDot: '0000000000',
      digitsList: Array(10).fill(0),
      unsimplifiedSum: 0,
      reductionSteps: [0],
      simplifiedSingleDigit: 0,
    };
  } else {
    transferredSqrtResult = transferredSum.sqrtDecimal(60);
  }

  return {
    inputText: text,
    rawChars,
    normalizedChars,
    totalChars: n,
    iterations: [iter1, iter2],
    visibleIteration: iter2,
    resultRows,
    transferredCount: transferredRows.length,
    transferredSumFraction: transferredSum,
    transferredSumDisplay: transferredSum.toString(),
    transferredSqrtResult,
    final10DigitSum: transferredSqrtResult.unsimplifiedSum,
    finalSingleDigit: transferredSqrtResult.simplifiedSingleDigit,
    reductionSteps: transferredSqrtResult.reductionSteps,
  };
}

// Aliases for backwards compatibility
export const calculateThreeIterations = calculateTwoPhases;
export const calculateFourIterations = calculateTwoPhases;
export const calculateArabicDualPhase = calculateTwoPhases;


