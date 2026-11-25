'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MultiSectionCalculationResult } from '@/types/math';
import {
  Check,
  CheckSquare,
  Square,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  Calculator,
  Layers,
  Hash,
  CheckCircle2,
  Table as TableIcon,
  PlusCircle,
  Undo2,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import FractionRatioInput from './FractionRatioInput';

interface ResultViewProps {
  result: MultiSectionCalculationResult | null;
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
  onAddSection?: () => void;
  onRemoveLastSection?: () => void;
  onSelectSection?: (index: number) => void;
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
  onAddSection,
  onRemoveLastSection,
  onSelectSection,
}: ResultViewProps) {
  // تصفية أسطر الجدول للعبارات الطويلة (الكل / المحددة / غير المحددة)
  const [filterMode, setFilterMode] = useState<'all' | 'selected' | 'unselected'>('all');
  // حالة الطي/الفتح لجدول التدقيق الحسابي للخطوات المعتادة
  const [showAuditDetails, setShowAuditDetails] = useState(false);

  if (!result) {
    return null;
  }

  // استخدام كائن القسم الحالي فقط للعرض والحساب
  const currentSection = result.currentSection;
  const sectionIdx = currentSection.sectionIndex;
  const totalSections = result.totalSectionsCount;
  const totalCount = result.totalChars;
  const selectedCount = currentSection.selectedCount;
  const selectedSqrt = currentSection.selectedSqrtResult;
  const isFirstSection = sectionIdx === 1;

  // تصفية أسطر القسم الحالي
  const filteredRows = useMemo(() => {
    if (filterMode === 'selected') {
      return currentSection.rows.filter(r => r.isSelected);
    }
    if (filterMode === 'unselected') {
      return currentSection.rows.filter(r => !r.isSelected);
    }
    return currentSection.rows;
  }, [currentSection.rows, filterMode]);

  // عرض الأرقام العشرة المنقطة باتجاه LTR الرياضي المعزول
  const renderDottedDigits = (intPart: string, first10Digits: string) => {
    const digits = first10Digits.split('');
    return (
      <div
        dir="ltr"
        style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
        className="p-3.5 bg-white text-slate-900 rounded-xl border border-slate-200 flex flex-wrap items-center justify-center gap-2 font-mono text-base sm:text-lg shadow-sm w-full min-w-0"
      >
        <span className="text-slate-950 font-black break-all max-w-full text-center leading-relaxed">
          {intPart}.
        </span>
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-50 px-2.5 sm:px-3 py-1 rounded-lg border border-slate-200 flex-shrink-0">
          {digits.map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-1" />
              <span className="text-slate-950 font-black text-sm sm:text-base">{digit}</span>
            </div>
          ))}
        </div>
        <span className="text-slate-400 font-bold tracking-widest text-sm flex-shrink-0">...</span>
      </div>
    );
  };

  return (
    <div className="space-y-4 dir-rtl font-cairo w-full min-w-0 animate-in fade-in duration-200" dir="rtl">
      {/* ============================================================ */}
      {/* 1. شريط رأس القسم الحالي والناتج المعتمد                     */}
      {/* ============================================================ */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center flex-shrink-0 shadow-2xs font-bold text-lg font-mono">
            {sectionIdx}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                حساب وتوضيح {currentSection.name} فقط
              </h2>
              <span className="text-xs bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-md font-bold border border-blue-200">
                القسم {sectionIdx} من إجمالي {totalSections}
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                {selectedCount} من {totalCount} خانات محددة
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold flex items-center gap-2 flex-wrap">
              <span>
                القيمة الابتدائية للقسم:{' '}
                <strong className="font-mono text-blue-900 font-bold" dir="ltr">
                  {currentSection.inputDisplay}
                </strong>
                {isFirstSection ? (
                  <span className="text-slate-400 text-xs mr-1">(النسبة المدخلة)</span>
                ) : (
                  <span className="text-emerald-700 text-xs mr-1 font-bold">(مرحّلة من القسم السابق)</span>
                )}
              </span>
              <span className="text-slate-300">•</span>
              <span>
                المجموع الكسري الخانات:{' '}
                <strong className="font-mono text-slate-900 font-bold" dir="ltr">
                  {currentSection.selectedSumDisplay}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* عرض الناتج النهائي المعتمد للقسم الحالي */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="px-5 py-2 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center gap-2 shadow-2xs">
            <span className="text-xs font-bold text-slate-700">ناتج القسم الحالي:</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono tracking-tight" dir="ltr">
              {currentSection.sectionResult}
            </span>
          </div>
          {currentSection.reductionSteps.length > 1 && (
            <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-600">المفرد:</span>
              <span className="font-black text-slate-900 font-mono text-base" dir="ltr">
                {currentSection.simplifiedSingleDigit}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* شريط التبديل بين الأقسام المُنشأة (يُعرض القسم المختار فقط) */}
      {totalSections > 1 && (
        <div className="p-2.5 bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-600 ml-1">عرض القسم:</span>
            {result.sections.map((sec) => (
              <button
                key={sec.sectionIndex}
                type="button"
                onClick={() => onSelectSection?.(sec.sectionIndex)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  sec.sectionIndex === sectionIdx
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {sec.name} {sec.sectionIndex === totalSections ? '(الأحدث)' : ''}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            يُعرض الحساب والتوضيح للقسم المحدد فقط
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. 🔵 الخطوات المعتادة (1 إلى 5) للقسم الحالي فقط           */}
      {/* ============================================================ */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="py-3 px-4 sm:px-5 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <CardTitle className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>🔵 الخطوات المعتادة</span>
                <span className="text-slate-400 font-normal">({currentSection.name})</span>
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                القيمة الابتدائية: <strong className="font-mono text-blue-900" dir="ltr">{currentSection.inputDisplay}</strong>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAuditDetails(!showAuditDetails)}
                className="text-xs h-7 px-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <span>{showAuditDetails ? 'إخفاء جدول التدقيق' : 'عرض جدول التدقيق'}</span>
                {showAuditDetails ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 space-y-3">
          {/* ملخص بطاقات الخطوات الخمس */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">1. القيمة الابتدائية:</span>
              <span className="font-mono font-bold text-slate-900 text-sm" dir="ltr">
                {currentSection.inputDisplay}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">2. مجموع الخطوة 2 (S2):</span>
              <span className="font-mono font-bold text-slate-900 text-sm" dir="ltr">
                {currentSection.sum2.toString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">3. الحروف المجمعة:</span>
              <span className="font-bold text-slate-900 text-sm">
                {Object.keys(currentSection.charGroups).length} حرف فريد
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">5. المجموع الكلي للخانات:</span>
              <span className="font-mono font-bold text-blue-900 text-sm" dir="ltr">
                {currentSection.totalSum.toString()}
              </span>
            </div>
          </div>

          {/* جدول التدقيق الحسابي المفصل للخطوات الخمس (قابل للطي) */}
          {showAuditDetails && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 animate-in fade-in duration-150">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2 w-12 text-center">#</th>
                    <th className="p-2 w-14 text-center">الحرف</th>
                    <th className="p-2 text-center">
                      {isFirstSection ? 'خطوة 2 (i²/n)' : 'خطوة 2 (كسر مرحل)'}
                    </th>
                    <th className="p-2 text-center">خطوة 3 ((v2/S2) × القيمة)</th>
                    <th className="p-2 text-center">خطوة 4 (جمع الحرف)</th>
                    <th className="p-2 text-center">خطوة 5 (النسبة %)</th>
                    <th className="p-2 text-center font-black">الكسر النهائي (خطوة 5)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentSection.rows.map((row) => (
                    <tr key={`audit-${row.pos}`} className="hover:bg-slate-50/50">
                      <td className="p-2 text-center font-mono font-bold" dir="ltr">
                        #{row.pos}
                      </td>
                      <td className="p-2 text-center font-bold text-slate-900">
                        {row.char}
                      </td>
                      <td className="p-2 text-center font-mono" dir="ltr">
                        {row.step2FractionDisplay}
                      </td>
                      <td className="p-2 text-center font-mono" dir="ltr">
                        {row.step3FractionDisplay}
                      </td>
                      <td className="p-2 text-center font-mono" dir="ltr">
                        {row.step4GroupFractionDisplay}
                      </td>
                      <td className="p-2 text-center font-mono" dir="ltr">
                        {row.step5PercentageDisplay}
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-blue-950" dir="ltr">
                        {row.finalFractionDisplay}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 3. 🔵 زر انتقال الخانات (الجدول والتحديد والتجميع والجذر)   */}
      {/* ============================================================ */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="py-3.5 px-4 sm:px-5 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                <span>🔵 زر انتقال الخانات</span>
                <span className="text-slate-400 font-normal">({currentSection.name})</span>
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                {totalCount} خانة
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              حدد أو ألغِ الخانات عبر زر الانتقال لاشتقاق المجموع الكسري والجذر وجمع أول 10 أرقام
            </p>
          </div>

          {/* شريط أدوات التصفية والتحديد السريع */}
          <div className="flex items-center gap-2 flex-wrap">
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
                onClick={() => setFilterMode('selected')}
                className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  filterMode === 'selected'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                المحددة ({selectedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('unselected')}
                className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  filterMode === 'unselected'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                غير المحددة ({totalCount - selectedCount})
              </button>
            </div>

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
          <div className="max-h-[380px] sm:max-h-[440px] overflow-y-auto overflow-x-hidden border-b border-slate-200">
            <table className="w-full text-right border-collapse">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-sm z-10 border-b border-slate-200 text-xs font-bold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3 w-14 text-center">#</th>
                  <th className="py-2.5 px-3 w-20 text-center">الحرف</th>
                  <th className="py-2.5 px-3 text-center">كسر الخانة (خطوة 5)</th>
                  <th className="py-2.5 px-4 w-36 text-center">زر انتقال الخانة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      لا توجد خانات تطابق خيار التصفية الحالي
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const originalIdx = row.pos - 1;
                    const isChecked = row.isSelected;
                    return (
                      <tr
                        key={`row-${row.pos}`}
                        onClick={() => onToggleTransfer?.(originalIdx)}
                        className={`transition-colors duration-100 cursor-pointer select-none ${
                          isChecked
                            ? 'bg-emerald-50/40 hover:bg-emerald-50/70 text-slate-900 font-medium'
                            : 'bg-white hover:bg-slate-50 text-slate-500 opacity-60'
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

                        {/* كسر الخانة في القسم الحالي */}
                        <td className="py-2.5 px-3 text-center">
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

                        {/* زر انتقال الخانة التفاعلي */}
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
                                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {isChecked ? (
                              <span className="flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>منتقلة (✓)</span>
                              </span>
                            ) : (
                              <span>زر انتقال</span>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* شريط الإجماليات والجذر وجمع أول 10 أرقام بعد الفاصلة */}
          <div className="p-4 bg-slate-50 space-y-3">
            {/* 1. جمع قيم الخانات المحددة فقط */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-700" />
                1. جمع قيم الخانات المحددة (✓) فقط ({selectedCount} من {totalCount} خانات):
              </span>
              <span
                dir="ltr"
                className="font-mono text-base sm:text-lg font-black text-emerald-900 bg-emerald-50 px-3 py-0.5 rounded-lg border border-emerald-200 inline-block self-end sm:self-auto break-all max-w-full"
              >
                {currentSection.selectedSumDisplay}
              </span>
            </div>

            {/* تفاصيل الجمع الكسري */}
            <div className="text-[11px] text-slate-500 font-mono px-1 break-all leading-relaxed" dir="ltr">
              {currentSection.rows
                .filter(r => r.isSelected)
                .map(r => r.finalFractionDisplay)
                .join(' + ') || '0'}{' '}
              = {currentSection.selectedSumDisplay}
            </div>

            {/* 2. أخذ الجذر التربيعي و 3. جمع أول 10 أرقام بعد الفاصلة */}
            <div className="space-y-2 pt-1 border-t border-slate-200 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-800 min-w-0">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  2. الجذر التربيعي و 3. جمع أول 10 أرقام بعد الفاصلة:
                </span>
                <span dir="ltr" className="font-mono text-slate-600 text-xs break-all max-w-full">
                  √({currentSection.selectedSumDisplay})
                </span>
              </div>

              {renderDottedDigits(
                selectedSqrt.intPart,
                selectedSqrt.first10AfterDot
              )}

              <div className="text-xs text-slate-500 text-center font-mono font-medium" dir="ltr">
                [{selectedSqrt.digitsList.join(', ')}]
              </div>
            </div>

            {/* بطاقة ناتج القسم الحالي */}
            <div className="p-4 rounded-xl bg-white border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  قيمة ناتج {currentSection.name}
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  مجموع الأرقام العشرة بعد الفاصلة للجذر التربيعي (القسم {sectionIdx})
                </h4>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="bg-emerald-50 border border-emerald-300 px-5 py-2 rounded-xl flex items-center gap-2">
                  <span className="text-xs text-emerald-900 font-bold">الناتج:</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono" dir="ltr">
                    {currentSection.sectionResult}
                  </span>
                </div>
                {currentSection.reductionSteps.length > 1 && (
                  <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-slate-500 block">المفرد</span>
                    <span className="text-base font-black text-slate-900 font-mono" dir="ltr">
                      {currentSection.simplifiedSingleDigit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 4. 🔵 زر إضافة قسم جديد                                      */}
      {/* ============================================================ */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-700" />
              <h3 className="text-sm sm:text-base font-black text-blue-950">
                🔵 زر إضافة قسم جديد (القسم {totalSections + 1})
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              عند الضغط، يتم ترحيل ناتج القسم الحالي (<strong className="font-mono text-blue-900">{currentSection.sectionResult}</strong>) كقيمة ابتدائية جديدة للقسم القادم، مع إخفاء حسابات الأقسام السابقة وعرض القسم الجديد فقط.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {totalSections > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRemoveLastSection}
                className="h-10 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border-slate-300 rounded-xl cursor-pointer"
                title="حذف آخر قسم والرجوع للقسم السابق"
              >
                <Undo2 className="w-3.5 h-3.5 ml-1 text-slate-500" />
                حذف آخر قسم
              </Button>
            )}

            <Button
              type="button"
              onClick={onAddSection}
              className="h-11 px-5 text-sm font-black bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة قسم جديد (القسم {totalSections + 1})</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 5. بطاقة اعتماد الجواب النهائي عند التوقف/الاكتفاء            */}
      {/* ============================================================ */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Info className="w-4 h-4 text-blue-700 flex-shrink-0" />
          <span>
            عند التوقف أو الاكتفاء بالعدد الحالي من الأقسام، يُعتمد ناتج القسم الأخير (
            <strong className="text-slate-900 font-bold">{currentSection.name}: {currentSection.sectionResult}</strong>
            ) باعتباره <strong>الجواب النهائي للمسألة</strong>.
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>الجواب النهائي المعتمد:</span>
          <span className="font-mono text-base font-black" dir="ltr">{currentSection.sectionResult}</span>
        </div>
      </div>
    </div>
  );
}
