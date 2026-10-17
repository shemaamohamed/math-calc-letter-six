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

export type BaseRatioInput =
  | { num: bigint | number | string; den: bigint | number | string }
  | number
  | string
  | Fraction;

/**
 * Execute a single phase/iteration of the 6-step Arabic fraction algorithm
 * @param chars - Normalized characters array
 * @param inputVal - The input number or fraction (5329 or custom fraction for phase 1, seed for phase 2)
 * @param iterationIndex - 1 or 2
 */
export function executeSingleIteration(
  chars: string[],
  inputVal: BaseRatioInput,
  iterationIndex: number
): IterationSummary {
  const n = chars.length;
  if (n === 0) {
    throw new Error('قائمة الحروف فارغة');
  }

  // 1. الخطوة 1: قيمة المدخل الإجمالية ككسر دقيق
  let sum1: Fraction;
  let inputDisplay: string;
  let normalizedInputVal: number | string;

  if (inputVal instanceof Fraction) {
    sum1 = inputVal;
    inputDisplay = sum1.den === ONE ? sum1.num.toString() : sum1.toString();
    normalizedInputVal = sum1.den === ONE ? Number(sum1.num) : sum1.toString();
  } else if (
    typeof inputVal === 'object' &&
    inputVal !== null &&
    'num' in inputVal &&
    'den' in inputVal
  ) {
    const rawNum = inputVal.num?.toString() || '1';
    const rawDen = inputVal.den?.toString() || '1';
    const nBig = BigInt(rawNum);
    const dBig = BigInt(rawDen);
    sum1 = new Fraction(nBig, dBig === 0n ? ONE : dBig);
    inputDisplay = rawDen !== '1' ? `${rawNum}/${rawDen}` : rawNum;
    normalizedInputVal = sum1.den === ONE ? Number(sum1.num) : inputDisplay;
  } else {
    const valStr = inputVal?.toString() || '1';
    if (valStr.includes('/')) {
      const [nStr, dStr] = valStr.split('/');
      const nBig = BigInt(nStr.trim());
      const dBig = BigInt(dStr.trim());
      sum1 = new Fraction(nBig, dBig === 0n ? ONE : dBig);
      inputDisplay = valStr;
      normalizedInputVal = sum1.den === ONE ? Number(sum1.num) : valStr;
    } else {
      const numVal = Number(inputVal);
      sum1 = new Fraction(BigInt(numVal), ONE);
      inputDisplay = numVal.toString();
      normalizedInputVal = numVal;
    }
  }

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
    inputVal: normalizedInputVal,
    inputDisplay,
    inputFraction: sum1,
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
 * @param customBaseRatio - Optional custom ratio/fraction for Phase 1 (default: BASE_VALUE 5329)
 */
export function calculateTwoPhases(
  text: string,
  transferredIndices?: number[],
  customBaseRatio?: BaseRatioInput
): TwoPhaseCalculationResult {
  const { rawChars, normalizedChars } = normalizeArabicText(text);
  const n = normalizedChars.length;

  if (n === 0) {
    throw new Error('يرجى إدخال نص عربي صحيح يحتوي على حروف قابلة للتحليل');
  }

  // تحديد النسبة الأساسية للقسم الأول (افتراضياً 5329/1)
  let rawRatioObj = { num: BASE_VALUE.toString(), den: '1' };
  let baseRatioDisplay = BASE_VALUE.toString();
  let baseFraction: Fraction;

  if (customBaseRatio !== undefined && customBaseRatio !== null) {
    if (customBaseRatio instanceof Fraction) {
      baseFraction = customBaseRatio;
      baseRatioDisplay = customBaseRatio.toString();
      rawRatioObj = {
        num: customBaseRatio.num.toString(),
        den: customBaseRatio.den.toString(),
      };
    } else if (typeof customBaseRatio === 'object') {
      const numStr = (customBaseRatio.num ?? BASE_VALUE).toString();
      const denStr = (customBaseRatio.den ?? 1).toString();
      const numBig = BigInt(numStr || BASE_VALUE);
      const denBig = BigInt(denStr || 1);
      baseFraction = new Fraction(numBig, denBig === 0n ? ONE : denBig);
      baseRatioDisplay = denStr !== '1' ? `${numStr}/${denStr}` : numStr;
      rawRatioObj = { num: numStr, den: denStr };
    } else {
      const valStr = customBaseRatio.toString();
      if (valStr.includes('/')) {
        const [nS, dS] = valStr.split('/');
        const numBig = BigInt(nS.trim());
        const denBig = BigInt(dS.trim());
        baseFraction = new Fraction(numBig, denBig === 0n ? ONE : denBig);
        baseRatioDisplay = valStr;
        rawRatioObj = { num: nS.trim(), den: dS.trim() };
      } else {
        const numVal = Number(customBaseRatio);
        baseFraction = new Fraction(BigInt(numVal), ONE);
        baseRatioDisplay = numVal.toString();
        rawRatioObj = { num: numVal.toString(), den: '1' };
      }
    }
  } else {
    baseFraction = new Fraction(BigInt(BASE_VALUE), ONE);
  }

  // --- القسم الأول (المخفي): الأساس المدخل كقاعدة استخراجية ---
  const iter1 = executeSingleIteration(
    normalizedChars,
    customBaseRatio !== undefined && customBaseRatio !== null
      ? (typeof customBaseRatio === 'object' && !(customBaseRatio instanceof Fraction)
          ? customBaseRatio
          : baseFraction)
      : BASE_VALUE,
    1
  );

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
    baseRatio: { num: baseFraction.num, den: baseFraction.den },
    baseRatioDisplay,
    rawBaseRatio: rawRatioObj,
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


