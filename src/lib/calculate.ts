/**
 * Dual-Phase Dynamic Letter & Fraction Calculation Engine (V2)
 * المحرك الحسابي الدقيق للغة العربية فائق الدقة (Arbitrary-Precision) عبر قسمين متتابعين:
 * - القسم الأول (المخفي): الحساب التأسيسي للكلمة مع النسبة الأساسية (مثل 80 أو 100)
 * - قنطرة الانتقال وتوليد البذرة: جمع كسور الحروف المنتقلة المحددة بأزرار الانتقال، واستخراج البذرة عبر الجذر التربيعي
 * - القسم الثاني (الظاهر): يعتمد حصرياً على الحروف المنتقلة وقيمها وكسورها لحساب جدول التحليل والناتج النهائي المعتمد
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

export const BASE_VALUE = 80;

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
 * Execute Phase 1 (القسم المخفي) of the 5-step Arabic fraction algorithm
 * @param chars - Normalized characters array of the input word
 * @param baseInput - The base ratio/fraction (e.g. 80/1 or custom fraction)
 */
export function executePhase1(
  chars: string[],
  baseInput: BaseRatioInput
): IterationSummary {
  const n = chars.length;
  if (n === 0) {
    throw new Error('قائمة الحروف فارغة');
  }

  // 1. الخطوة 1: قيمة المدخل الإجمالية ككسر دقيق
  let sum1: Fraction;
  let inputDisplay: string;
  let normalizedInputVal: number | string;

  if (baseInput instanceof Fraction) {
    sum1 = baseInput;
    inputDisplay = sum1.den === ONE ? sum1.num.toString() : sum1.toString();
    normalizedInputVal = sum1.den === ONE ? Number(sum1.num) : sum1.toString();
  } else if (
    typeof baseInput === 'object' &&
    baseInput !== null &&
    'num' in baseInput &&
    'den' in baseInput
  ) {
    const rawNum = baseInput.num?.toString() || BASE_VALUE.toString();
    const rawDen = baseInput.den?.toString() || '1';
    const nBig = BigInt(rawNum);
    const dBig = BigInt(rawDen);
    sum1 = new Fraction(nBig, dBig === 0n ? ONE : dBig);
    inputDisplay = rawDen !== '1' ? `${rawNum}/${rawDen}` : rawNum;
    normalizedInputVal = sum1.den === ONE ? Number(sum1.num) : inputDisplay;
  } else {
    const valStr = baseInput?.toString() || BASE_VALUE.toString();
    if (valStr.includes('/')) {
      const [nStr, dStr] = valStr.split('/');
      const nBig = BigInt(nStr.trim());
      const dBig = BigInt(dStr.trim());
      sum1 = new Fraction(nBig, dBig === 0n ? ONE : dBig);
      inputDisplay = valStr;
      normalizedInputVal = sum1.den === ONE ? Number(sum1.num) : valStr;
    } else {
      const numVal = Number(baseInput) || BASE_VALUE;
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

  // 4. الخطوة 4: جمع طبيعي لنواتج خطوة 3 للأحرف المتماثلة
  const charGroups: Record<string, Fraction> = {};
  chars.forEach((c, idx) => {
    const v3 = step3Fractions[idx];
    charGroups[c] = charGroups[c] ? charGroups[c].add(v3) : v3;
  });

  // 5. الخطوة 5: حساب النسبة المئوية (v3 ÷ sum1 × 100) وضربها بقيمة الحرف من خطوة 4
  const step5Fractions = step3Fractions.map(v3 => {
    if (sum1.isZero()) return new Fraction(0n, ONE);
    return v3.div(sum1).mul(new Fraction(HUNDRED, ONE));
  });
  let sum5 = new Fraction(0n, ONE);
  step5Fractions.forEach(f => {
    sum5 = sum5.add(f);
  });

  const step6RatioFractions = step5Fractions;

  const finalFractions = chars.map((c, idx) => {
    const charGroupVal = charGroups[c];
    const v3 = step3Fractions[idx];
    if (sum1.isZero()) return new Fraction(0n, ONE);
    return charGroupVal.mul(v3).div(sum1);
  });

  // الناتج الإجمالي للقسم الأول: جمع الخانات النهائية
  let totalSum = new Fraction(0n, ONE);
  finalFractions.forEach(f => {
    totalSum = totalSum.add(f);
  });

  // جذر المجموع واستخراج أول 10 أرقام بعد الفاصلة
  const sqrtResult = totalSum.isZero()
    ? createEmptySqrtResult()
    : totalSum.sqrtDecimal(60);

  const extracted10DigitSum =
    sqrtResult.unsimplifiedSum > 0 ? sqrtResult.unsimplifiedSum : 1;

  return {
    iterationIndex: 1,
    name: ITERATION_NAMES[0],
    isBackground: true,
    inputVal: normalizedInputVal,
    inputDisplay,
    inputFraction: sum1,
    chars,
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
 * Execute Phase 2 (القسم الثاني الظاهر) based strictly on transferred letters & mapped Phase 1 fractions
 * @param selectedChars - Array of selected characters transferred to Phase 2
 * @param mappedStep2Fractions - Phase 1 final fractions for only the selected letters
 * @param seed - The integer seed derived from square root of sum of mappedStep2Fractions
 * @param originalIndices - The slot indices in the original word
 * @param selectedPhase1Sum - Sum of Phase 1 fractions for the selected letters
 * @param selectedPhase1SqrtResult - Sqrt result of selectedPhase1Sum
 */
export function executePhase2(
  selectedChars: string[],
  mappedStep2Fractions: Fraction[],
  seed: number,
  originalIndices: number[],
  selectedPhase1Sum: Fraction,
  selectedPhase1SqrtResult: DecimalSquareRootResult
): IterationSummary {
  const m = selectedChars.length;

  if (m === 0) {
    const emptyFrac = new Fraction(0n, ONE);
    const emptySqrt = createEmptySqrtResult();
    return {
      iterationIndex: 2,
      name: ITERATION_NAMES[1],
      isBackground: false,
      inputVal: 0,
      inputDisplay: '0',
      inputFraction: emptyFrac,
      chars: [],
      originalIndices: [],
      sum1: emptyFrac,
      sum2: emptyFrac,
      step2Fractions: [],
      step3Fractions: [],
      charGroups: {},
      step5Fractions: [],
      sum5: emptyFrac,
      step6RatioFractions: [],
      finalFractions: [],
      totalSum: emptyFrac,
      sqrtResult: emptySqrt,
      extracted10DigitSum: 0,
      selectedPhase1Sum: emptyFrac,
      selectedPhase1SqrtResult: emptySqrt,
    };
  }

  // 1. الخطوة 1 للقسم الثاني: البذرة المستخرجة
  const seedFrac = new Fraction(BigInt(seed), ONE);
  const inputDisplay = seed.toString();

  // 2. الخطوة 2 للقسم الثاني: ترحيل الكسور النهائية للحروف المختارة من القسم الأول
  const step2Fractions = mappedStep2Fractions;
  let sum2 = new Fraction(0n, ONE);
  step2Fractions.forEach(f => {
    sum2 = sum2.add(f);
  });

  // 3. الخطوة 3: التوزيع النسبي بالبذرة: (قيمة خطوة 2 ÷ S2) × البذرة
  const step3Fractions = step2Fractions.map(v2 => {
    if (sum2.isZero()) return new Fraction(0n, ONE);
    return v2.div(sum2).mul(seedFrac);
  });

  // 4. الخطوة 4: جمع الحروف المتماثلة في نواتج خطوة 3 للحروف المنتقلة
  const charGroups: Record<string, Fraction> = {};
  selectedChars.forEach((c, idx) => {
    const v3 = step3Fractions[idx];
    charGroups[c] = charGroups[c] ? charGroups[c].add(v3) : v3;
  });

  // 5. الخطوة 5: النسب المئوية (v3 ÷ البذرة × 100) وضربها بقيم الحروف من خطوة 4
  const step5Fractions = step3Fractions.map(v3 => {
    if (seedFrac.isZero()) return new Fraction(0n, ONE);
    return v3.div(seedFrac).mul(new Fraction(HUNDRED, ONE));
  });
  let sum5 = new Fraction(0n, ONE);
  step5Fractions.forEach(f => {
    sum5 = sum5.add(f);
  });

  const step6RatioFractions = step5Fractions;

  const finalFractions = selectedChars.map((c, idx) => {
    const charGroupVal = charGroups[c];
    const v3 = step3Fractions[idx];
    if (seedFrac.isZero()) return new Fraction(0n, ONE);
    return charGroupVal.mul(v3).div(seedFrac);
  });

  // جمع الخانات النهائية للقسم الثاني
  let totalSum = new Fraction(0n, ONE);
  finalFractions.forEach(f => {
    totalSum = totalSum.add(f);
  });

  // الجذر النهائي والتحقق
  const sqrtResult = totalSum.isZero()
    ? createEmptySqrtResult()
    : totalSum.sqrtDecimal(60);

  const extracted10DigitSum = sqrtResult.unsimplifiedSum;

  return {
    iterationIndex: 2,
    name: ITERATION_NAMES[1],
    isBackground: false,
    inputVal: seed,
    inputDisplay,
    inputFraction: seedFrac,
    chars: selectedChars,
    originalIndices,
    sum1: seedFrac,
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
    selectedPhase1Sum,
    selectedPhase1SqrtResult,
  };
}

function createEmptySqrtResult(): DecimalSquareRootResult {
  return {
    intPart: '0',
    fracPart: '0'.repeat(60),
    fullString: '0.' + '0'.repeat(60),
    first10AfterDot: '0000000000',
    digitsList: Array(10).fill(0),
    unsimplifiedSum: 0,
    reductionSteps: [0],
    simplifiedSingleDigit: 0,
  };
}

/**
 * Execute the Full 2-Phase Calculation Engine for Arabic Text
 * @param text - The input Arabic text
 * @param transferredIndices - Indices of slots transferred in Phase 2 via transition buttons
 * @param customBaseRatio - Optional custom ratio/fraction for Phase 1 (default: BASE_VALUE 80)
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

  // 1. تحديد النسبة الأساسية للقسم الأول (افتراضياً 80/1)
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
        const numVal = Number(customBaseRatio) || BASE_VALUE;
        baseFraction = new Fraction(BigInt(numVal), ONE);
        baseRatioDisplay = numVal.toString();
        rawRatioObj = { num: numVal.toString(), den: '1' };
      }
    }
  } else {
    baseFraction = new Fraction(BigInt(BASE_VALUE), ONE);
  }

  // --- المرحلة 1: تنفيذ القسم الأول (المخفي) ---
  const iter1 = executePhase1(normalizedChars, baseFraction);

  // --- المرحلة 2: تحديد الحروف المنتقلة وقنطرة توليد البذرة ---
  // افتراضياً: يتم نقل كافة الحروف ما لم يحدد المستخدم خلاف ذلك
  const activeSelected =
    transferredIndices !== undefined
      ? transferredIndices.filter(i => i >= 0 && i < n)
      : normalizedChars.map((_, i) => i);

  // استخراج الحروف والكسور المنتقلة فقط
  const selectedChars: string[] = [];
  const selectedMappedFractions: Fraction[] = [];
  let transferredPhase1Sum = new Fraction(0n, ONE);

  activeSelected.forEach(idx => {
    selectedChars.push(normalizedChars[idx]);
    const rawFrac = iter1.finalFractions[idx];
    const frac = rawFrac instanceof Fraction ? rawFrac : new Fraction(rawFrac.num, rawFrac.den);
    selectedMappedFractions.push(frac);
    transferredPhase1Sum = transferredPhase1Sum.add(frac);
  });

  // توليد البذرة للقسم الثاني عبر الجذر التربيعي لمجموع كسور الحروف المنتقلة
  let seedSqrtResult: DecimalSquareRootResult;
  let seedGenerated: number;

  if (activeSelected.length === 0 || transferredPhase1Sum.isZero()) {
    seedSqrtResult = createEmptySqrtResult();
    seedGenerated = 0;
  } else {
    seedSqrtResult = transferredPhase1Sum.sqrtDecimal(60);
    seedGenerated = seedSqrtResult.unsimplifiedSum > 0 ? seedSqrtResult.unsimplifiedSum : 1;
  }

  // --- المرحلة 3: تنفيذ القسم الثاني (الظاهر) بالحروف المنتقلة والبذرة المولدة ---
  const iter2 = executePhase2(
    selectedChars,
    selectedMappedFractions,
    seedGenerated,
    activeSelected,
    transferredPhase1Sum,
    seedSqrtResult
  );

  // بناء أسطر الجدول الكاملة لكافة حروف الكلمة الأصلية
  // الخانات المنتقلة تأخذ كسرها النهائي المحسوب في القسم الثاني
  // الخانات غير المنتقلة تظهر بدون كسر القسم الثاني
  const resultRows: ResultRowItem[] = normalizedChars.map((char, idx) => {
    const isTransferred = activeSelected.includes(idx);
    const p1Frac = iter1.finalFractions[idx];
    
    let finalFrac: Fraction;
    let finalFracDisplay: string;

    if (isTransferred) {
      const posInSelected = activeSelected.indexOf(idx);
      const rawFinal = iter2.finalFractions[posInSelected];
      finalFrac = rawFinal
        ? (rawFinal instanceof Fraction ? rawFinal : new Fraction(rawFinal.num, rawFinal.den))
        : new Fraction(0n, ONE);
      finalFracDisplay = finalFrac.toString();
    } else {
      finalFrac = new Fraction(0n, ONE);
      finalFracDisplay = '-';
    }

    const p1Display = p1Frac instanceof Fraction ? p1Frac.toString() : `${p1Frac.num}/${p1Frac.den}`;

    return {
      pos: idx + 1,
      char,
      originalChar: rawChars[idx] || char,
      phase1Fraction: p1Frac,
      phase1FractionDisplay: p1Display,
      finalFraction: finalFrac,
      finalFractionDisplay: finalFracDisplay,
      isTransferred,
    };
  });

  const transferredSqrtResult = iter2.sqrtResult;

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
    hiddenIteration: iter1,
    transferredCount: activeSelected.length,
    transferredIndices: activeSelected,
    transferredLetters: selectedChars,
    transferredPhase1SumFraction: transferredPhase1Sum,
    transferredPhase1SumDisplay: transferredPhase1Sum.toString(),
    transferredPhase1SqrtResult: seedSqrtResult,
    seedGenerated,
    resultRows,
    transferredSumFraction: iter2.totalSum,
    transferredSumDisplay: iter2.totalSum.toString(),
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
