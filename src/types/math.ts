/**
 * Exact Fractional & Calculation Type Definitions for Dual-Phase Dynamic Letter & Fraction Calculation Engine (V2)
 * تعريفات الأنواع الرياضية للحساب فائق الدقة (Arbitrary-Precision) عبر قسمين متتابعين
 * - القسم الأول (المخفي): الحساب التأسيسي للكلمة مع النسبة الأساسية (مثل 80 أو 100)
 * - القسم الثاني (الظاهر): يعتمد حصرياً على الحروف المنتقلة المحددة بأزرار الانتقال لاستخراج البذرة وبناء الحساب
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

export interface BaseRatio {
  num: string | number | bigint;
  den: string | number | bigint;
}

export interface IterationSummary {
  iterationIndex: number; // 1 (القسم الأول المخفي) or 2 (القسم الثاني الظاهر)
  name: string; // "القسم الأول (المخفي)", "القسم الثاني (الظاهر)"
  isBackground: boolean; // true for 1; false for 2
  inputVal: number | string; // 80 or custom ratio for phase 1; seed for phase 2
  inputDisplay?: string; // النص المعروض للمدخل (مثل "80" أو "54/2")
  inputFraction?: FractionType; // القيمة الكسرية الدقيقة للمدخل/البذرة
  
  // الحروف النشطة في هذا القسم ومواقعها
  chars: string[];
  originalIndices?: number[]; // الفهارس في الكلمة الأصلية
  
  sum1: FractionType; // المدخل الإجمالي (الأساس أو البذرة)
  sum2: FractionType; // مجموع الخطوة 2
  step2Fractions: FractionType[]; // قيم الخطوة 2
  step3Fractions: FractionType[]; // قيم الخطوة 3
  charGroups: Record<string, FractionType>; // جمع الحروف المتماثلة في الخطوة 4
  step5Fractions: FractionType[]; // نسب الخطوة 5 (Step 3 ÷ Base × 100)
  sum5: FractionType; // مجموع الخطوة 5 (عادة 100%)
  step6RatioFractions: FractionType[]; // مصفوفة النسب المئوية
  finalFractions: FractionType[]; // الكسور النهائية لكل خانة
  totalSum: FractionType; // مجموع الخانات النهائية
  sqrtResult: DecimalSquareRootResult; // جذر المجموع
  extracted10DigitSum: number; // ناتج جمع أول 10 أرقام بعد الفاصلة
  
  // معلومات قنطرة الانتقال (مجموع وجذر الحروف المنتقلة من القسم الأول لتوليد بذرة القسم الثاني)
  selectedPhase1Sum?: FractionType; // مجموع كسور الحروف المنتقلة (مثل 1924/45)
  selectedPhase1SqrtResult?: DecimalSquareRootResult; // جذر مجموع الحروف المنتقلة (مثل 6.5387... -> 48)
}

export interface ResultRowItem {
  pos: number;
  char: string;
  originalChar: string;
  phase1Fraction?: FractionType; // الكسر النهائي المقابل من القسم الأول
  phase1FractionDisplay?: string;
  finalFraction: FractionType; // الكسر النهائي في القسم الثاني (أو صفر إذا لم تنقل)
  finalFractionDisplay: string;
  isTransferred: boolean; // هل تم نقل الحرف عبر زر الانتقال؟
}

export interface TwoPhaseCalculationResult {
  inputText: string;
  rawChars: string[];
  normalizedChars: string[];
  totalChars: number;
  baseRatio?: FractionType;
  baseRatioDisplay?: string;
  rawBaseRatio?: { num: string; den: string };
  iterations: IterationSummary[]; // [Phase 1 (Hidden), Phase 2 (Visible)]
  visibleIteration: IterationSummary; // Phase 2 (Visible)
  hiddenIteration: IterationSummary; // Phase 1 (Hidden)
  
  // بيانات قنطرة الانتقال وتوليد البذرة (Seed Generation Bridge)
  transferredCount: number;
  transferredIndices: number[];
  transferredLetters: string[];
  transferredPhase1SumFraction: FractionType; // مجموع كسور الحروف المنتقلة (مثل 1924/45)
  transferredPhase1SumDisplay: string;
  transferredPhase1SqrtResult: DecimalSquareRootResult; // جذر المجموع واستخراج البذرة
  seedGenerated: number; // البذرة المولدة للقسم الثاني (مثل 48)
  
  // أسطر الجدول التفاعلي في القسم الثاني
  resultRows: ResultRowItem[];
  
  // الناتج النهائي للقسم الثاني
  transferredSumFraction: FractionType; // مجموع أسطر القسم الثاني (مثل 7994928/231361)
  transferredSumDisplay: string;
  transferredSqrtResult: DecimalSquareRootResult; // جذر الناتج النهائي
  final10DigitSum: number; // مجموع أول 10 أرقام بعد الفاصلة (مثل 40)
  finalSingleDigit: number; // الرقم المفرد النهائي (مثل 4)
  reductionSteps: number[]; // خطوات الاختزال
}

// Aliases for backwards compatibility
export type ThreeIterationCalculationResult = TwoPhaseCalculationResult;
export type FourIterationCalculationResult = TwoPhaseCalculationResult;
export type DualPhaseResult = TwoPhaseCalculationResult;
export type CalculationState = TwoPhaseCalculationResult;
