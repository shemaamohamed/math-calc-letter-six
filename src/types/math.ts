/**
 * Exact Fractional & Calculation Type Definitions for 3-Iteration Arabic Numerology Calculator
 * تعريفات الأنواع الرياضية للحساب فائق الدقة (Arbitrary-Precision) عبر 3 دورات متتابعة
 * - القسم الأول (مخفي): الأساس 260 ➔ استخراج البذرة 1
 * - القسم الثاني (مخفي): الأساس بذرة 1 ➔ استخراج البذرة 2
 * - القسم الثالث (الظاهر): الأساس بذرة 2 ➔ عرض جدول الحروف والكسور مع أزرار الانتقال التفاعلية
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
  iterationIndex: number; // 1, 2, or 3
  name: string; // "القسم الأول (المخفي)", "القسم الثاني (المخفي)", "القسم الثالث (الظاهر)"
  isBackground: boolean; // true for 1, 2; false for 3
  inputVal: number; // 260 for iter 1, seed for 2..3
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

export interface ThreeIterationCalculationResult {
  inputText: string;
  rawChars: string[];
  normalizedChars: string[];
  totalChars: number;
  iterations: IterationSummary[]; // 3 iterations (1, 2, 3)
  visibleIteration: IterationSummary; // Iteration 3
  resultRows: ResultRowItem[]; // Rows with transfer toggle for Section 3 Table
  transferredCount: number;
  transferredSumFraction: FractionType;
  transferredSumDisplay: string;
  transferredSqrtResult: DecimalSquareRootResult;
  final10DigitSum: number;
  finalSingleDigit: number;
  reductionSteps: number[];
}

// Aliases for backwards compatibility
export type FourIterationCalculationResult = ThreeIterationCalculationResult;
export type DualPhaseResult = ThreeIterationCalculationResult;
export type CalculationState = ThreeIterationCalculationResult;

