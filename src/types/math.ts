/**
 * Exact Fractional & Calculation Type Definitions for 2-Phase Arabic Numerology Calculator
 * تعريفات الأنواع الرياضية للحساب فائق الدقة (Arbitrary-Precision) عبر قسمين متتابعين
 * - القسم الأول (مخفي): الأساس 73 ➔ استخراج البذرة
 * - القسم الثاني (الظاهر): الأساس البذرة المستخرجة ➔ عرض جدول الحروف والكسور مع أزرار الانتقال التفاعلية
 */

export interface FractionType {
  num: bigint;
  den: bigint;
}

export interface DecimalSquareRootResult {
  intPart: string;
  fracPart: string;
  fullString: string;
  first10AfterDot: string;
  digitsList: number[];
  unsimplifiedSum: number; // مجموع أول 10 أرقام بعد الفاصلة
  reductionSteps: number[]; // مسار الاختزال الرقمي إلى رقم مفرد
  simplifiedSingleDigit: number; // الرقم المفرد النهائي
}

export interface SlotData {
  pos: number;
  char: string;
  originalChar: string;
  step1Val: number;
  step2Frac: FractionType;
  step3Frac: FractionType;
  step4GroupFrac: FractionType;
  step5Frac: FractionType;
  step6RatioFrac: FractionType;
  finalValueFrac: FractionType;
  isSelected: boolean;
}

export interface IterationSummary {
  iterationIndex: number; // 1 (القسم الأول المخفي) or 2 (القسم الثاني الظاهر)
  name: string; // "القسم الأول (المخفي)", "القسم الثاني (الظاهر)"
  isBackground: boolean; // true for 1; false for 2
  inputVal: number; // 73 for phase 1, seed for phase 2
  sum1: FractionType;
  sum2: FractionType;
  step2Fractions: FractionType[];
  step3Fractions: FractionType[];
  charGroups: Record<string, FractionType>;
  step5Fractions: FractionType[];
  sum5: FractionType;
  step6RatioFractions: FractionType[];
  finalFractions: FractionType[];
  totalSum: FractionType;
  sqrtResult: DecimalSquareRootResult;
  extracted10DigitSum: number; // Seed produced
}

export interface ResultRowItem {
  pos: number;
  char: string;
  originalChar: string;
  finalFraction: FractionType;
  finalFractionDisplay: string;
  isTransferred: boolean;
}

export interface TwoPhaseCalculationResult {
  inputText: string;
  rawChars: string[];
  normalizedChars: string[];
  totalChars: number;
  iterations: IterationSummary[]; // 2 phases: [Phase 1 (Hidden), Phase 2 (Visible)]
  visibleIteration: IterationSummary; // Phase 2 (Visible)
  resultRows: ResultRowItem[]; // Rows with transfer toggle for Section 2 Table
  transferredCount: number;
  transferredSumFraction: FractionType;
  transferredSumDisplay: string;
  transferredSqrtResult: DecimalSquareRootResult;
  final10DigitSum: number;
  finalSingleDigit: number;
  reductionSteps: number[];
}

// Aliases for backwards compatibility
export type ThreeIterationCalculationResult = TwoPhaseCalculationResult;
export type FourIterationCalculationResult = TwoPhaseCalculationResult;
export type DualPhaseResult = TwoPhaseCalculationResult;
export type CalculationState = TwoPhaseCalculationResult;

