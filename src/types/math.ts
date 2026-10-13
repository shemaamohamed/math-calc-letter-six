/**
 * Exact Fractional & Calculation Type Definitions for 4-Iteration Arabic Numerology Calculator
 * تعريفات الأنواع الرياضية للحساب فائق الدقة (Arbitrary-Precision) عبر 4 دورات متتابعة
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
  iterationIndex: number; // 1 to 4
  name: string; // e.g. "القسم الأول (المخفي)", "القسم الرابع (الظاهر)"
  isBackground: boolean; // true for 1, 2, 3; false for 4
  inputVal: number; // 260 for iter 1, seed for 2..4
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
  extracted10DigitSum: number; // Seed produced for next iteration
}

export interface ResultRowItem {
  pos: number;
  char: string;
  originalChar: string;
  finalFraction: FractionType;
  finalFractionDisplay: string;
  isTransferred: boolean;
}

export interface FourIterationCalculationResult {
  inputText: string;
  rawChars: string[];
  normalizedChars: string[];
  totalChars: number;
  iterations: IterationSummary[]; // All 4 iterations
  visibleIteration: IterationSummary; // Iteration 4
  resultRows: ResultRowItem[]; // Rows with transfer toggle for Section 4
  transferredCount: number;
  transferredSumFraction: FractionType;
  transferredSumDisplay: string;
  transferredSqrtResult: DecimalSquareRootResult;
  final10DigitSum: number;
  finalSingleDigit: number;
  reductionSteps: number[];
}

// Backwards compatibility alias
export type DualPhaseResult = FourIterationCalculationResult;
export type CalculationState = FourIterationCalculationResult;
