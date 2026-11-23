/**
 * Exact Fractional & Calculation Type Definitions for Multi-Section Dynamic Letter & Fraction Engine
 * تعريفات الأنواع الرياضية للحساب فائق الدقة (Arbitrary-Precision) مع دعم الأقسام اللانهائية
 * - كل قسم يتكون من: 1) الخطوات المعتادة، 2) زر انتقال الخانات، 3) زر إضافة قسم
 * - يُعرض الحساب والتوضيح للقسم الحالي فقط
 * - ترحيل ناتج القسم السابق كقيمة ابتدائية للقسم الجديد
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

export interface BaseRatio {
  num: string | number | bigint;
  den: string | number | bigint;
}

export interface SectionRowItem {
  pos: number;
  char: string;
  originalChar: string;
  step2Fraction: FractionType;
  step2FractionDisplay: string;
  step3Fraction: FractionType;
  step3FractionDisplay: string;
  step4GroupFraction: FractionType;
  step4GroupFractionDisplay: string;
  step5PercentageFraction: FractionType;
  step5PercentageDisplay: string;
  finalFraction: FractionType;
  finalFractionDisplay: string;
  isSelected: boolean;
}

export interface SectionData {
  sectionIndex: number; // 1, 2, 3, 4, ...
  name: string; // "القسم 1", "القسم 2", ...
  inputVal: number | string;
  inputDisplay: string;
  inputFraction: FractionType;
  chars: string[];
  
  // 🔵 الخطوات المعتادة (1 إلى 5)
  sum1: FractionType; // القيمة الابتدائية للقسم
  sum2: FractionType; // مجموع الخطوة 2
  step2Fractions: FractionType[]; // قيم الخطوة 2
  step3Fractions: FractionType[]; // قيم الخطوة 3
  charGroups: Record<string, FractionType>; // جمع الحروف المتماثلة في الخطوة 4
  step5PercentageFractions: FractionType[]; // نسب الخطوة 5
  step5Fractions: FractionType[]; // الكسور النهائية لكل خانة في الخطوة 5
  totalSum: FractionType; // مجموع كافة الخانات
  
  // 🔵 زر انتقال الخانات (التحديد الديناميكي للقسم الحالي)
  rows: SectionRowItem[];
  selectedIndices: number[];
  selectedCount: number;
  selectedSumFraction: FractionType;
  selectedSumDisplay: string;
  selectedSqrtResult: DecimalSquareRootResult;
  sectionResult: number; // ناتج جمع أول 10 أرقام (قيمة القسم الحالية المعتمدة)
  simplifiedSingleDigit: number;
  reductionSteps: number[];
  
  // Backwards compatibility fields for IterationSummary
  isBackground?: boolean;
  step6RatioFractions?: FractionType[];
  finalFractions?: FractionType[];
  sqrtResult?: DecimalSquareRootResult;
  extracted10DigitSum?: number;
  sum5?: FractionType;
  iterationIndex?: number;
}

export interface MultiSectionCalculationResult {
  inputText: string;
  rawChars: string[];
  normalizedChars: string[];
  totalChars: number;
  baseRatio?: FractionType;
  baseRatioDisplay?: string;
  rawBaseRatio?: { num: string; den: string };
  
  // بيانات الأقسام المتتابعة
  sections: SectionData[];
  currentSectionIndex: number; // رقم القسم النشط حالياً المعروض (1, 2, 3, ...)
  currentSection: SectionData; // كائن القسم الحالي فقط المعروض
  totalSectionsCount: number; // إجمالي الأقسام المُنشأة
  
  // الجواب النهائي المعتمد للقسم الحالي
  finalAnswer: number;
  finalAnswerSingleDigit: number;
  reductionSteps: number[];

  // Aliases for backwards compatibility with previous components
  iterations: SectionData[];
  visibleIteration: SectionData;
  hiddenIteration?: SectionData;
  resultRows: ResultRowItem[];
  transferredCount: number;
  transferredIndices: number[];
  transferredLetters: string[];
  transferredSumFraction: FractionType;
  transferredSumDisplay: string;
  transferredSqrtResult: DecimalSquareRootResult;
  final10DigitSum: number;
  finalSingleDigit: number;
  seedGenerated: number;
  transferredPhase1SumFraction: FractionType;
  transferredPhase1SumDisplay: string;
  transferredPhase1SqrtResult: DecimalSquareRootResult;
}

// Backwards compatibility types
export type IterationSummary = SectionData;
export interface ResultRowItem {
  pos: number;
  char: string;
  originalChar: string;
  phase1Fraction?: FractionType;
  phase1FractionDisplay?: string;
  finalFraction: FractionType;
  finalFractionDisplay: string;
  isTransferred: boolean;
}

export type TwoPhaseCalculationResult = MultiSectionCalculationResult;
export type ThreeIterationCalculationResult = MultiSectionCalculationResult;
export type FourIterationCalculationResult = MultiSectionCalculationResult;
export type DualPhaseResult = MultiSectionCalculationResult;
export type CalculationState = MultiSectionCalculationResult;

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
