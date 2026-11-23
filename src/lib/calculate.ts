/**
 * Multi-Section Dynamic Letter & Fraction Calculation Engine
 * المحرك الحسابي الدقيق للغة العربية فائق الدقة (Arbitrary-Precision) مع دعم الأقسام اللانهائية
 * - يقبل أي مدخل: حرف واحد، حرفين، كلمة، جملة، أو مقال كامل
 * - يتكون كل قسم من: 1) الخطوات المعتادة، 2) زر انتقال الخانات، 3) زر إضافة قسم
 * - يُعرض الحساب والتوضيح للقسم الحالي فقط
 * - ترحيل ناتج القسم السابق كقيمة ابتدائية للقسم الجديد
 */

import { Fraction, DecimalSquareRootResult, ONE, HUNDRED } from './fractionMath';
import { normalizeArabicText, normalizeChar } from './rules';
import {
  SectionData,
  SectionRowItem,
  MultiSectionCalculationResult,
  ResultRowItem,
  TwoPhaseCalculationResult,
} from '../types/math';

export { normalizeChar };
export type {
  SectionData,
  SectionRowItem,
  MultiSectionCalculationResult,
  ResultRowItem,
  TwoPhaseCalculationResult,
};

export const BASE_VALUE = 80;

export type BaseRatioInput =
  | { num: bigint | number | string; den: bigint | number | string }
  | number
  | string
  | Fraction;

export function parseBaseRatio(baseInput?: BaseRatioInput): {
  fraction: Fraction;
  display: string;
  raw: { num: string; den: string };
} {
  if (baseInput === undefined || baseInput === null) {
    const f = new Fraction(BigInt(BASE_VALUE), ONE);
    return {
      fraction: f,
      display: BASE_VALUE.toString(),
      raw: { num: BASE_VALUE.toString(), den: '1' },
    };
  }

  if (baseInput instanceof Fraction) {
    return {
      fraction: baseInput,
      display: baseInput.den === ONE ? baseInput.num.toString() : baseInput.toString(),
      raw: { num: baseInput.num.toString(), den: baseInput.den.toString() },
    };
  }

  if (
    typeof baseInput === 'object' &&
    'num' in baseInput &&
    'den' in baseInput
  ) {
    const rawNum = baseInput.num?.toString() || BASE_VALUE.toString();
    const rawDen = baseInput.den?.toString() || '1';
    const nBig = BigInt(rawNum);
    const dBig = BigInt(rawDen);
    const f = new Fraction(nBig, dBig === 0n ? ONE : dBig);
    const display = rawDen !== '1' ? `${rawNum}/${rawDen}` : rawNum;
    return {
      fraction: f,
      display,
      raw: { num: rawNum, den: rawDen },
    };
  }

  const valStr = baseInput.toString();
  if (valStr.includes('/')) {
    const [nStr, dStr] = valStr.split('/');
    const nBig = BigInt(nStr.trim());
    const dBig = BigInt(dStr.trim());
    const f = new Fraction(nBig, dBig === 0n ? ONE : dBig);
    return {
      fraction: f,
      display: valStr,
      raw: { num: nStr.trim(), den: dStr.trim() },
    };
  }

  const numVal = Number(baseInput) || BASE_VALUE;
  const f = new Fraction(BigInt(numVal), ONE);
  return {
    fraction: f,
    display: numVal.toString(),
    raw: { num: numVal.toString(), den: '1' },
  };
}

export function createEmptySqrtResult(): DecimalSquareRootResult {
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
 * حساب قسم مفرد بكامل خطواته الخمس وتحديده التفاعلي
 * @param chars - مصفوفة الحروف الموحدة
 * @param inputVal - القيمة الابتدائية للقسم (كسر أو رقم)
 * @param previousStep5Fractions - كسور الخطوة 5 المرحّلة من القسم السابق (إن وجدت)
 * @param selectedIndices - فهارس الخانات المحددة بزر انتقال الخانات
 * @param sectionIndex - رقم القسم (1, 2, 3, ...)
 * @param rawChars - الحروف الأصلية قبل التوحيد
 */
export function calculateSection(
  chars: string[],
  inputVal: BaseRatioInput,
  previousStep5Fractions?: (Fraction | { num: bigint; den: bigint })[],
  selectedIndices?: number[],
  sectionIndex = 1,
  rawChars?: string[]
): SectionData {
  const n = chars.length;
  if (n === 0) {
    throw new Error('قائمة الحروف فارغة');
  }

  // 1. الخطوة 1: القيمة الابتدائية للقسم
  const parsed = parseBaseRatio(inputVal);
  const sum1 = parsed.fraction;
  const inputDisplay = parsed.display;
  const normalizedInputVal = sum1.den === ONE ? Number(sum1.num) : inputDisplay;

  // 2. الخطوة 2:
  // في كل الأقسام (القسم الأول وأي قسم جديد ناتج عن زر إضافة قسم):
  // تُنفّذ الخطوات المعتادة لحساب أوزان الحروف: (i ÷ n) × i = i^2 / n
  // والقيمة الابتدائية (الأساس) فقط هي التي تتغير وترث ناتج القسم السابق
  let step2Fractions: Fraction[];
  if (previousStep5Fractions && previousStep5Fractions.length === n) {
    step2Fractions = previousStep5Fractions.map(f =>
      f instanceof Fraction ? f : new Fraction(f.num, f.den)
    );
  } else {
    step2Fractions = chars.map((_, i) => {
      const idx = BigInt(i + 1);
      return new Fraction(idx * idx, BigInt(n));
    });
  }

  let sum2 = new Fraction(0n, ONE);
  step2Fractions.forEach(f => {
    sum2 = sum2.add(f);
  });

  // 3. الخطوة 3: التوزيع النسبي (قيمة خطوة 2 ÷ S2) × القيمة الابتدائية للقسم
  const step3Fractions = step2Fractions.map(v2 => {
    if (sum2.isZero()) return new Fraction(0n, ONE);
    return v2.div(sum2).mul(sum1);
  });

  // 4. الخطوة 4: جمع الحروف المتماثلة في نواتج خطوة 3
  const charGroups: Record<string, Fraction> = {};
  chars.forEach((c, idx) => {
    const v3 = step3Fractions[idx];
    charGroups[c] = charGroups[c] ? charGroups[c].add(v3) : v3;
  });

  // 5. الخطوة 5: النسب المئوية (v3 ÷ sum1 × 100) وضربها بقيم الحروف من خطوة 4
  const step5PercentageFractions = step3Fractions.map(v3 => {
    if (sum1.isZero()) return new Fraction(0n, ONE);
    return v3.div(sum1).mul(new Fraction(HUNDRED, ONE));
  });

  const step5Fractions = chars.map((c, idx) => {
    const charGroupVal = charGroups[c];
    const v3 = step3Fractions[idx];
    if (sum1.isZero()) return new Fraction(0n, ONE);
    return charGroupVal.mul(v3).div(sum1);
  });

  let totalSum = new Fraction(0n, ONE);
  step5Fractions.forEach(f => {
    totalSum = totalSum.add(f);
  });

  // 🔵 زر انتقال الخانات (التحديد التفاعلي للخانات في القسم الحالي)
  const activeSelected =
    selectedIndices !== undefined
      ? selectedIndices.filter(i => i >= 0 && i < n)
      : chars.map((_, i) => i);

  // جمع قيم الخانات المحددة فقط
  let selectedSum = new Fraction(0n, ONE);
  activeSelected.forEach(idx => {
    selectedSum = selectedSum.add(step5Fractions[idx]);
  });

  // أخذ الجذر التربيعي للمجموع وجمع أول 10 أرقام بعد الفاصلة
  let selectedSqrtResult: DecimalSquareRootResult;
  let sectionResult: number;

  if (activeSelected.length === 0 || selectedSum.isZero()) {
    selectedSqrtResult = createEmptySqrtResult();
    sectionResult = 0;
  } else {
    selectedSqrtResult = selectedSum.sqrtDecimal(60);
    sectionResult = selectedSqrtResult.unsimplifiedSum;
  }

  // بناء أسطر الجدول الكاملة للقسم الحالي
  const rows: SectionRowItem[] = chars.map((char, idx) => {
    const isSelected = activeSelected.includes(idx);
    const v2 = step2Fractions[idx];
    const v3 = step3Fractions[idx];
    const grp = charGroups[char];
    const p5 = step5PercentageFractions[idx];
    const f5 = step5Fractions[idx];

    return {
      pos: idx + 1,
      char,
      originalChar: rawChars?.[idx] || char,
      step2Fraction: v2,
      step2FractionDisplay: v2.toString(),
      step3Fraction: v3,
      step3FractionDisplay: v3.toString(),
      step4GroupFraction: grp,
      step4GroupFractionDisplay: grp.toString(),
      step5PercentageFraction: p5,
      step5PercentageDisplay: p5.den === ONE ? `${p5.num}%` : `${p5.num}/${p5.den}%`,
      finalFraction: f5,
      finalFractionDisplay: f5.toString(),
      isSelected,
    };
  });

  return {
    sectionIndex,
    name: `القسم ${sectionIndex}`,
    inputVal: normalizedInputVal,
    inputDisplay,
    inputFraction: sum1,
    chars,
    sum1,
    sum2,
    step2Fractions,
    step3Fractions,
    charGroups,
    step5PercentageFractions,
    step5Fractions,
    totalSum,
    rows,
    selectedIndices: activeSelected,
    selectedCount: activeSelected.length,
    selectedSumFraction: selectedSum,
    selectedSumDisplay: selectedSum.toString(),
    selectedSqrtResult,
    sectionResult,
    simplifiedSingleDigit: selectedSqrtResult.simplifiedSingleDigit,
    reductionSteps: selectedSqrtResult.reductionSteps,

    // Backwards compatibility mappings
    isBackground: false,
    step6RatioFractions: step5PercentageFractions,
    finalFractions: step5Fractions,
    sqrtResult: selectedSqrtResult,
    extracted10DigitSum: sectionResult,
    sum5: new Fraction(HUNDRED, ONE),
    iterationIndex: sectionIndex,
  };
}

/**
 * Execute Multi-Section Pipeline with Dynamic Number of Sections
 * @param text - Input Arabic text (single char, word, sentence, or full article)
 * @param baseRatio - Initial base ratio for Section 1 (default: 80)
 * @param sectionsSelectedIndices - Per-section array of selected slot indices
 * @param totalSectionsCount - How many sections to generate (1, 2, 3, 5, 10, ...)
 * @param activeSectionIndex - Which section is currently viewed (1-based index)
 */
export function calculateMultiSection(
  text: string,
  baseRatio?: BaseRatioInput,
  sectionsSelectedIndices?: number[][],
  totalSectionsCount = 1,
  activeSectionIndex?: number
): MultiSectionCalculationResult {
  const { rawChars, normalizedChars } = normalizeArabicText(text);
  const n = normalizedChars.length;

  if (n === 0) {
    throw new Error('يرجى إدخال نص عربي صحيح يحتوي على حروف قابلة للتحليل');
  }

  const baseParsed = parseBaseRatio(baseRatio);
  const K = Math.max(1, totalSectionsCount || 1);
  const sections: SectionData[] = [];

  // --- القسم 1 ---
  const sec1 = calculateSection(
    normalizedChars,
    baseParsed.fraction,
    undefined,
    sectionsSelectedIndices?.[0],
    1,
    rawChars
  );
  sections.push(sec1);

  // --- الأقسام اللاحقة الناتجة عن زر إضافة قسم ---
  for (let s = 2; s <= K; s++) {
    const prevSec = sections[s - 2];
    const seedVal = prevSec.sectionResult > 0 ? prevSec.sectionResult : 1;
    const seedFrac = new Fraction(BigInt(seedVal), ONE);

    // تُعاد الخطوات المعتادة لنفس الحروف، مع استخدام ناتج القسم السابق كقيمة ابتدائية جديدة
    const secS = calculateSection(
      normalizedChars,
      seedFrac,
      undefined,
      sectionsSelectedIndices?.[s - 1],
      s,
      rawChars
    );
    sections.push(secS);
  }

  // تحديد القسم الحالي المعروض فقط
  const targetCurrentIdx =
    activeSectionIndex !== undefined
      ? Math.min(Math.max(1, activeSectionIndex), K)
      : K;

  const currentSection = sections[targetCurrentIdx - 1];

  // أسطر التوافق للواجهات السابقة
  const resultRows: ResultRowItem[] = currentSection.rows.map(r => ({
    pos: r.pos,
    char: r.char,
    originalChar: r.originalChar,
    phase1Fraction: sections[0]?.step5Fractions[r.pos - 1],
    phase1FractionDisplay: sections[0]?.step5Fractions[r.pos - 1]?.toString() || '-',
    finalFraction: r.finalFraction,
    finalFractionDisplay: r.finalFractionDisplay,
    isTransferred: r.isSelected,
  }));

  const selectedChars = currentSection.selectedIndices.map(i => normalizedChars[i]);

  return {
    inputText: text,
    rawChars,
    normalizedChars,
    totalChars: n,
    baseRatio: { num: baseParsed.fraction.num, den: baseParsed.fraction.den },
    baseRatioDisplay: baseParsed.display,
    rawBaseRatio: baseParsed.raw,
    sections,
    currentSectionIndex: targetCurrentIdx,
    currentSection,
    totalSectionsCount: K,
    finalAnswer: currentSection.sectionResult,
    finalAnswerSingleDigit: currentSection.simplifiedSingleDigit,
    reductionSteps: currentSection.reductionSteps,

    // Backwards compatibility aliases
    iterations: sections,
    visibleIteration: currentSection,
    hiddenIteration: sections[0],
    resultRows,
    transferredCount: currentSection.selectedCount,
    transferredIndices: currentSection.selectedIndices,
    transferredLetters: selectedChars,
    transferredSumFraction: currentSection.selectedSumFraction,
    transferredSumDisplay: currentSection.selectedSumDisplay,
    transferredSqrtResult: currentSection.selectedSqrtResult,
    final10DigitSum: currentSection.sectionResult,
    finalSingleDigit: currentSection.simplifiedSingleDigit,
    seedGenerated: sections.length > 1 ? Number(sections[1].inputVal) : sec1.sectionResult,
    transferredPhase1SumFraction: sec1.selectedSumFraction,
    transferredPhase1SumDisplay: sec1.selectedSumDisplay,
    transferredPhase1SqrtResult: sec1.selectedSqrtResult,
  };
}

/**
 * Backwards compatible function for calculateTwoPhases
 */
export function calculateTwoPhases(
  text: string,
  transferredIndices?: number[],
  customBaseRatio?: BaseRatioInput
): TwoPhaseCalculationResult {
  // If transferredIndices is provided, it applies to Section 2 (or Section 1 if only 1 section)
  const sectionsSelections: number[][] = [
    undefined as unknown as number[], // Section 1 default all
    transferredIndices || (undefined as unknown as number[]), // Section 2
  ];

  return calculateMultiSection(text, customBaseRatio, sectionsSelections, 2, 2);
}

// Aliases for backwards compatibility
export const calculateThreeIterations = calculateTwoPhases;
export const calculateFourIterations = calculateTwoPhases;
export const calculateArabicDualPhase = calculateTwoPhases;
