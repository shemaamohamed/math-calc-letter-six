'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TwoPhaseCalculationResult } from '@/types/math';
import {
  Check,
  CheckSquare,
  Square,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  Calculator,
  Layers,
  Eye,
  EyeOff,
  Hash,
  CheckCircle2,
  Table as TableIcon,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import FractionRatioInput from './FractionRatioInput';

interface ResultViewProps {
  result: TwoPhaseCalculationResult | null;
  onToggleTransfer?: (index: number) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onInvertSelection?: () => void;
  baseRatio?: { num: string; den: string };
  isCustomRatioActive?: boolean;
  onNumeratorChange?: (num: string) => void;
  onDenominatorChange?: (den: string) => void;
  onToggleCustomRatio?: () => void;
  onApplyCustomRatio?: () => void;
}

export default function ResultView({
  result,
  onToggleTransfer,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  baseRatio,
  isCustomRatioActive = true,
  onNumeratorChange,
  onDenominatorChange,
  onToggleCustomRatio,
  onApplyCustomRatio,
}: ResultViewProps) {
  // تصفية أسطر الجدول للعبارات الطويلة (الكل / المنتقلة / غير المنتقلة)
  const [filterMode, setFilterMode] = useState<'all' | 'transferred' | 'untransferred'>('all');
  // حالة الطي/الفتح لجدول التدقيق الرياضي الشامل
  const [showAuditDetails, setShowAuditDetails] = useState(false);
  const [auditIterationTab, setAuditIterationTab] = useState<number>(2);

  if (!result) {
    return null;
  }

  const { visibleIteration, hiddenIteration, resultRows, transferredSqrtResult } = result;
  const transferredCount = result.transferredCount;
  const totalCount = result.totalChars;

  // تصفية الأسطر حسب الاختيار
  const filteredRows = useMemo(() => {
    if (filterMode === 'transferred') {
      return resultRows.filter(r => r.isTransferred);
    }
    if (filterMode === 'untransferred') {
      return resultRows.filter(r => !r.isTransferred);
    }
    return resultRows;
  }, [resultRows, filterMode]);

  // عرض الأرقام العشرة المنقطة باتجاه LTR الرياضي المعزول
  const renderDottedDigits = (intPart: string, first10Digits: string) => {
    const digits = first10Digits.split('');
    return (
      <div
        dir="ltr"
        style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
        className="p-3.5 bg-white text-slate-900 rounded-xl border border-slate-200 flex flex-wrap items-center justify-center gap-2 font-mono text-base sm:text-lg shadow-sm"
      >
        <span className="text-slate-950 font-black">{intPart}.</span>
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-50 px-2.5 sm:px-3 py-1 rounded-lg border border-slate-200">
          {digits.map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-1" />
              <span className="text-slate-950 font-black text-sm sm:text-base">{digit}</span>
            </div>
          ))}
        </div>
        <span className="text-slate-400 font-bold tracking-widest text-sm">...</span>
      </div>
    );
  };

  return (
    <div className="space-y-4 dir-rtl font-cairo w-full min-w-0 animate-in fade-in duration-200" dir="rtl">
      {/* ============================================================ */}
      {/* 1. شريط المعاينة السريعة للناتج النهائي في أعلى النتائج        */}
      {/* ============================================================ */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                الناتج النهائي المعتمد (القسم الثاني الظاهر)
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md font-bold border border-emerald-200">
                {transferredCount} من {totalCount} خانات منتقلة
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold flex items-center gap-2 flex-wrap">
              <span>
                المجموع الكسري:{' '}
                <strong className="font-mono text-slate-900 font-bold" dir="ltr">
                  {result.transferredSumDisplay}
                </strong>
              </span>
              <span className="text-slate-300">•</span>
              <span>
                الجذر:{' '}
                <strong className="font-mono text-slate-900 font-bold" dir="ltr">
                  {transferredSqrtResult.intPart}.{transferredSqrtResult.first10AfterDot.substring(0, 5)}...
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="px-5 py-2 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">الناتج:</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono tracking-tight" dir="ltr">
              {result.final10DigitSum}
            </span>
          </div>
          {result.reductionSteps.length > 1 && (
            <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-600">المفرد:</span>
              <span className="font-black text-slate-900 font-mono text-base" dir="ltr">
                {result.finalSingleDigit}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. مسار تسلسل القسمين المتتابعين وقنطرة توليد البذرة         */}
      {/* ============================================================ */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="py-3 px-4 sm:px-5 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <CardTitle className="text-xs sm:text-sm font-black text-slate-900">
                تسلسل القسمين المتتابعين وقنطرة توليد البذرة
              </CardTitle>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
              قسم أول مخفي (أساس {result.baseRatioDisplay || '80'}) ➔ قنطرة البذرة ➔ القسم الثاني الظاهر
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* البطاقة 1: القسم الأول (المخفي) */}
            <div className="p-3.5 rounded-xl border bg-slate-50/60 border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded bg-slate-200 text-slate-800">
                    1. القسم الأول (المخفي)
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <EyeOff className="w-3 h-3" />
                    تأسيسي بالخلفية
                  </span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div>
                    الأساس المدخل:{' '}
                    <span className="font-bold font-mono text-slate-900" dir="ltr">
                      {result.baseRatioDisplay}
                    </span>
                  </div>
                  <div>
                    عدد الحروف:{' '}
                    <span className="font-bold text-slate-900">{totalCount}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">النسبة الكسرية:</span>
                <FractionRatioInput
                  size="sm"
                  numerator={baseRatio?.num ?? result.rawBaseRatio?.num ?? '80'}
                  denominator={baseRatio?.den ?? result.rawBaseRatio?.den ?? '1'}
                  isActive={isCustomRatioActive}
                  onNumeratorChange={onNumeratorChange || (() => {})}
                  onDenominatorChange={onDenominatorChange || (() => {})}
                  onToggleActive={onToggleCustomRatio}
                  onApply={onApplyCustomRatio}
                />
              </div>
            </div>

            {/* البطاقة 2: قنطرة الانتقال وتوليد البذرة */}
            <div className="p-3.5 rounded-xl border bg-amber-50/50 border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded bg-amber-600 text-white flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    قنطرة توليد البذرة
                  </span>
                  <span className="text-[11px] text-amber-800 font-bold">
                    مجموع القسم الأول
                  </span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">مجموع كسور القسم 1:</span>
                    <span className="font-mono font-bold text-amber-950" dir="ltr">
                      {result.transferredPhase1SumDisplay}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">جذر المجموع:</span>
                    <span className="font-mono text-[11px] text-slate-800" dir="ltr">
                      √({result.transferredPhase1SumDisplay}) = {result.transferredPhase1SqrtResult.intPart}.{result.transferredPhase1SqrtResult.first10AfterDot.substring(0, 4)}...
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200/80 flex items-center justify-between text-xs">
                <span className="text-amber-900 font-bold">البذرة المستخرجة:</span>
                <span className="font-mono font-black text-amber-800 text-base" dir="ltr">
                  {result.seedGenerated}
                </span>
              </div>
            </div>

            {/* البطاقة 3: القسم الثاني (الظاهر) */}
            <div className="p-3.5 rounded-xl border bg-blue-50/60 border-blue-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded bg-blue-700 text-white">
                    2. القسم الثاني (الظاهر)
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-blue-800 font-bold">
                    <Eye className="w-3 h-3" />
                    تفاعلي بالبذرة
                  </span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div>
                    الأساس المعتمد:{' '}
                    <span className="font-bold font-mono text-blue-900" dir="ltr">
                      البذرة ({result.seedGenerated})
                    </span>
                  </div>
                  <div>
                    الحروف المعالجة:{' '}
                    <span className="font-bold text-slate-900">
                      {result.transferredLetters.join(' - ') || 'لا يوجد'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-blue-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">الناتج الرقمي:</span>
                <span className="font-mono font-black text-blue-900 text-base" dir="ltr">
                  {result.final10DigitSum}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 3. جدول تحليل الحروف والكسور (القسم الثاني - الظاهر والتفاعلي) */}
      {/* ============================================================ */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="py-3.5 px-4 sm:px-5 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                جدول تحليل الحروف والكسور (القسم الثاني الظاهر)
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                {totalCount} حرف
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              حدد أو ألغِ الحروف عبر زر الانتقال لحساب البذرة ونقلها إلى القسم الثاني فورياً
            </p>
          </div>

          {/* شريط أدوات التحكم السريع وتصفية الأسطر */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* تصفية العرض */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الكل ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('transferred')}
                className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  filterMode === 'transferred'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                المنتقلة ({transferredCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('untransferred')}
                className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  filterMode === 'untransferred'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                غير المنتقلة ({totalCount - transferredCount})
              </button>
            </div>

            {/* أزرار التحديد والتبديل */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSelectAll}
                className="text-xs h-7 px-2 bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-bold cursor-pointer"
                title="تحديد الكل"
              >
                <CheckSquare className="w-3 h-3 ml-1 text-emerald-700" />
                تحديد الكل
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDeselectAll}
                className="text-xs h-7 px-2 bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-bold cursor-pointer"
                title="إلغاء التحديد"
              >
                <Square className="w-3 h-3 ml-1 text-slate-400" />
                إلغاء
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onInvertSelection}
                className="text-xs h-7 px-2 bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-bold cursor-pointer"
                title="عكس التحديد"
              >
                <ArrowLeftRight className="w-3 h-3 ml-1 text-blue-700" />
                عكس
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* حاوية الجدول المدمجة لمنع التمرير الزائد وتوفير رأس ثابت sticky */}
          <div className="max-h-[380px] sm:max-h-[440px] overflow-y-auto overflow-x-hidden border-b border-slate-200">
            <table className="w-full text-right border-collapse">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-sm z-10 border-b border-slate-200 text-xs font-bold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3 w-14 text-center">#</th>
                  <th className="py-2.5 px-3 w-20 text-center">الحرف</th>
                  <th className="py-2.5 px-3 text-center">كسر القسم الأول (المخفي)</th>
                  <th className="py-2.5 px-4 w-36 text-center">زر الانتقال</th>
                  <th className="py-2.5 px-4 text-center">الكسر النهائي (القسم الثاني)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      لا توجد حروف تطابق خيار التصفية الحالي
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const originalIdx = row.pos - 1;
                    const isChecked = row.isTransferred;
                    return (
                      <tr
                        key={`table-row-${row.pos}`}
                        onClick={() => onToggleTransfer?.(originalIdx)}
                        className={`transition-colors duration-100 cursor-pointer select-none ${
                          isChecked
                            ? 'bg-emerald-50/40 hover:bg-emerald-50/70 text-slate-900 font-medium'
                            : 'bg-white hover:bg-slate-50 text-slate-500 opacity-70'
                        }`}
                      >
                        {/* رقم الخانة */}
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className="inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-600"
                            dir="ltr"
                          >
                            #{row.pos}
                          </span>
                        </td>

                        {/* الحرف */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-slate-300 font-black text-slate-900 text-base shadow-2xs">
                            {row.char}
                          </span>
                        </td>

                        {/* كسر القسم الأول المخفي */}
                        <td className="py-2.5 px-3 text-center">
                          <span
                            dir="ltr"
                            className="inline-block font-mono font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-xs shadow-2xs"
                          >
                            {row.phase1FractionDisplay || '-'}
                          </span>
                        </td>

                        {/* زر الانتقال التفاعلي */}
                        <td className="py-2.5 px-4 text-center">
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleTransfer?.(originalIdx);
                            }}
                            className={`h-7 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {isChecked ? (
                              <span className="flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>منتقلة</span>
                              </span>
                            ) : (
                              <span>زر انتقال</span>
                            )}
                          </Button>
                        </td>

                        {/* الكسر النهائي في القسم الثاني */}
                        <td className="py-2.5 px-4 text-center">
                          <span
                            dir="ltr"
                            className={`inline-block font-mono font-bold px-2.5 py-1 rounded text-xs sm:text-sm shadow-2xs ${
                              isChecked
                                ? 'text-slate-950 bg-white border border-emerald-300'
                                : 'text-slate-400 bg-slate-50 border border-dashed border-slate-200'
                            }`}
                          >
                            {row.finalFractionDisplay}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* شريط الإجماليات والنتائج بعد الجدول */}
          <div className="p-4 bg-slate-50 space-y-3">
            {/* مجموع الخانات المنتقلة في القسم الثاني */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-700" />
                المجموع الكسري النهائي للقسم الثاني ({transferredCount} من {totalCount} خانات):
              </span>
              <span
                dir="ltr"
                className="font-mono text-base sm:text-lg font-black text-blue-900 bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-200 inline-block self-end sm:self-auto"
              >
                {result.transferredSumDisplay}
              </span>
            </div>

            {/* تفاصيل الجمع الكسري */}
            <div className="text-[11px] text-slate-500 font-mono px-1 overflow-x-auto" dir="ltr">
              {resultRows
                .filter(r => r.isTransferred)
                .map(r => r.finalFractionDisplay)
                .join(' + ') || '0'}{' '}
              = {result.transferredSumDisplay}
            </div>

            {/* الجذر التربيعي والأرقام العشرة المنقطة */}
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-amber-600" />
                  الجذر التربيعي وأول 10 أرقام بعد الفاصلة:
                </span>
                <span dir="ltr" className="font-mono text-slate-600">
                  √({result.transferredSumDisplay})
                </span>
              </div>

              {renderDottedDigits(
                transferredSqrtResult.intPart,
                transferredSqrtResult.first10AfterDot
              )}

              <div className="text-xs text-slate-500 text-center font-mono font-medium" dir="ltr">
                [{transferredSqrtResult.digitsList.join(', ')}]
              </div>
            </div>

            {/* بطاقة الاعتماد والناتج النهائي في أسفل الجدول */}
            <div className="p-4 rounded-xl bg-white border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  الناتج الرقمي المعتمد
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  مجموع الأرقام العشرة بعد الفاصلة للقسم الثاني الظاهر
                </h4>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="bg-emerald-50 border border-emerald-300 px-5 py-2 rounded-xl flex items-center gap-2">
                  <span className="text-xs text-emerald-900 font-bold">الناتج:</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono" dir="ltr">
                    {result.final10DigitSum}
                  </span>
                </div>
                {result.reductionSteps.length > 1 && (
                  <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-slate-500 block">المفرد</span>
                    <span className="text-base font-black text-slate-900 font-mono" dir="ltr">
                      {result.finalSingleDigit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 4. تفاصيل التدقيق الرياضي الكامل (قابل للطي)                   */}
      {/* ============================================================ */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <div
          onClick={() => setShowAuditDetails(!showAuditDetails)}
          className="py-3 px-4 sm:px-5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-slate-600" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              عرض خطوات التدقيق الحسابي التفصيلي (الخطوات 1 إلى 5 للقسمين)
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <span>{showAuditDetails ? 'إخفاء' : 'عرض'}</span>
            {showAuditDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {showAuditDetails && (
          <CardContent className="p-4 space-y-4">
            {/* تبويبات القسمين */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              {result.iterations.map(iter => (
                <button
                  key={iter.iterationIndex}
                  type="button"
                  onClick={() => setAuditIterationTab(iter.iterationIndex)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    auditIterationTab === iter.iterationIndex
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {iter.name}
                </button>
              ))}
            </div>

            {/* تفاصيل القسم المحدد */}
            {(() => {
              const currentAuditIter =
                result.iterations.find(it => it.iterationIndex === auditIterationTab) ||
                result.iterations[0];

              const isPhase2Tab = currentAuditIter.iterationIndex === 2;

              return (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">
                        {isPhase2Tab ? 'البذرة المستخرجة:' : 'المدخل الأساسي:'}
                      </span>
                      <span className="font-mono font-bold text-slate-900" dir="ltr">
                        {currentAuditIter.inputDisplay || currentAuditIter.inputVal}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">مجموع الخطوة 2 (S2):</span>
                      <span className="font-mono font-bold text-slate-900" dir="ltr">
                        {currentAuditIter.sum2.toString()}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">مجموع الخطوة 5 (النسب):</span>
                      <span className="font-mono font-bold text-slate-900" dir="ltr">
                        {currentAuditIter.sum5.toString()}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">مجموع الخانات (Total):</span>
                      <span className="font-mono font-bold text-slate-900" dir="ltr">
                        {currentAuditIter.totalSum.toString()}
                      </span>
                    </div>
                  </div>

                  {/* جدول تفريغ الخطوات الخمس لكل حرف */}
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-100 font-bold text-slate-700">
                        <tr>
                          <th className="p-2 w-12 text-center">#</th>
                          <th className="p-2 w-14 text-center">الحرف</th>
                          <th className="p-2 text-center">
                            {isPhase2Tab ? 'خطوة 2 (كسر منقول)' : 'خطوة 2 (i²/n)'}
                          </th>
                          <th className="p-2 text-center">خطوة 3 ((v2/S2)×الأساس)</th>
                          <th className="p-2 text-center">خطوة 4 (جمع الحرف)</th>
                          <th className="p-2 text-center">خطوة 5 (النسبة %)</th>
                          <th className="p-2 text-center">الكسر النهائي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentAuditIter.chars.map((ch, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2 text-center font-mono font-bold" dir="ltr">
                              #{idx + 1}
                            </td>
                            <td className="p-2 text-center font-bold text-slate-900">{ch}</td>
                            <td className="p-2 text-center font-mono" dir="ltr">
                              {currentAuditIter.step2Fractions[idx]?.toString() || '-'}
                            </td>
                            <td className="p-2 text-center font-mono" dir="ltr">
                              {currentAuditIter.step3Fractions[idx]?.toString() || '-'}
                            </td>
                            <td className="p-2 text-center font-mono" dir="ltr">
                              {currentAuditIter.charGroups[ch]?.toString() || '-'}
                            </td>
                            <td className="p-2 text-center font-mono" dir="ltr">
                              {currentAuditIter.step5Fractions[idx]?.toString() || '-'}%
                            </td>
                            <td className="p-2 text-center font-mono font-bold text-blue-950" dir="ltr">
                              {currentAuditIter.finalFractions[idx]?.toString() || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
