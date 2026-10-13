'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThreeIterationCalculationResult } from '@/types/math';
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
  Filter,
} from 'lucide-react';

interface ResultViewProps {
  result: ThreeIterationCalculationResult | null;
  onToggleTransfer?: (index: number) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onInvertSelection?: () => void;
}

export default function ResultView({
  result,
  onToggleTransfer,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
}: ResultViewProps) {
  // تصفية أسطر الجدول للعبارات الطويلة (الكل / المنتقلة / غير المنتقلة)
  const [filterMode, setFilterMode] = useState<'all' | 'transferred' | 'untransferred'>('all');
  // حالة الطي/الفتح لجدول التدقيق الرياضي الشامل
  const [showAuditDetails, setShowAuditDetails] = useState(false);
  const [auditIterationTab, setAuditIterationTab] = useState<number>(3);

  if (!result) {
    return null;
  }

  const { visibleIteration, resultRows, transferredSqrtResult } = result;
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
                الناتج النهائي المعتمد (الدورة 3 الظاهرة)
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
      {/* 2. مسار تسلسل الدورات الثلاث المتتابعة (2 مخفية + 1 ظاهرة)     */}
      {/* ============================================================ */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="py-3 px-4 sm:px-5 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <CardTitle className="text-xs sm:text-sm font-black text-slate-900">
                مسار الدورات الثلاث المتتابعة
              </CardTitle>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
              دورتان مخفيتان ➔ الدورة الثالثة الظاهرة
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {result.iterations.map((iter, idx) => {
              const isCurrent = iter.iterationIndex === 3;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/50 border-blue-300'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      الدورة {iter.iterationIndex}
                    </span>
                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-xs text-blue-800 font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        الظاهر
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <EyeOff className="w-3.5 h-3.5" />
                        مخفي
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-700 font-medium">
                    المدخل الأساسي: <span className="font-bold font-mono text-slate-900" dir="ltr">{iter.inputVal}</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/80">
                    <span className="text-slate-500 font-medium">مجموع 10 أرقام:</span>
                    <span
                      className={`font-mono font-black ${
                        isCurrent ? 'text-blue-900 text-sm' : 'text-slate-900'
                      }`}
                      dir="ltr"
                    >
                      {iter.extracted10DigitSum}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 3. جدول تحليل الحروف والكسور (القسم الثالث - الظاهر والتفاعلي) */}
      {/* ============================================================ */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="py-3.5 px-4 sm:px-5 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                جدول تحليل الحروف والكسور (الدورة 3 الظاهرة)
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                {totalCount} حرف
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              انقر على أي سطر لتبديل حالة النقل، أو استخدم أزرار التحكم السريع
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
          <div className="max-h-[360px] sm:max-h-[420px] overflow-y-auto overflow-x-hidden border-b border-slate-200">
            <table className="w-full text-right border-collapse">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-sm z-10 border-b border-slate-200 text-xs font-bold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3 w-14 text-center">#</th>
                  <th className="py-2.5 px-3 w-20 text-center">الحرف</th>
                  <th className="py-2.5 px-3 w-28 hidden sm:table-cell text-center">المدخل الأصلي</th>
                  <th className="py-2.5 px-4 text-center">الكسر النهائي</th>
                  <th className="py-2.5 px-4 w-32 text-center">زر الانتقال</th>
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

                        {/* المدخل الأصلي */}
                        <td className="py-2.5 px-3 text-center text-slate-500 hidden sm:table-cell font-medium">
                          {row.originalChar}
                        </td>

                        {/* الكسر النهائي */}
                        <td className="py-2.5 px-4 text-center">
                          <span
                            dir="ltr"
                            className="inline-block font-mono font-bold text-slate-950 bg-white px-2.5 py-1 rounded border border-slate-200 text-xs sm:text-sm shadow-2xs"
                          >
                            {row.finalFractionDisplay}
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
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* شريط الإجماليات والنتائج بعد الجدول */}
          <div className="p-4 bg-slate-50 space-y-3">
            {/* مجموع الخانات المنتقلة */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-700" />
                المجموع الكسري للخانات المنتقلة ({transferredCount} من {totalCount}):
              </span>
              <span
                dir="ltr"
                className="font-mono text-base sm:text-lg font-black text-blue-900 bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-200 inline-block self-end sm:self-auto"
              >
                {result.transferredSumDisplay}
              </span>
            </div>

            {/* تفاصيل الجمع الكسري عند الرغبة */}
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
                  مجموع الأرقام العشرة بعد الفاصلة للدورة الثالثة
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
              عرض خطوات التدقيق الحسابي التفصيلي (الخطوات 1 إلى 6 للدورات الثلاث)
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <span>{showAuditDetails ? 'إخفاء' : 'عرض'}</span>
            {showAuditDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {showAuditDetails && (
          <CardContent className="p-4 space-y-4">
            {/* تبويبات الدورات الثلاث */}
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

            {/* تفاصيل الدورة المحددة */}
            {(() => {
              const currentAuditIter =
                result.iterations.find(it => it.iterationIndex === auditIterationTab) ||
                result.iterations[0];

              return (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">المدخل الإجمالي:</span>
                      <span className="font-mono font-bold text-slate-900" dir="ltr">{currentAuditIter.inputVal}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">مجموع الخطوة 2 (S2):</span>
                      <span className="font-mono font-bold text-slate-900" dir="ltr">{currentAuditIter.sum2.toString()}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">مجموع الخطوة 5 (S5):</span>
                      <span className="font-mono font-bold text-slate-900" dir="ltr">{currentAuditIter.sum5.toString()}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">مجموع الخانات (Total):</span>
                      <span className="font-mono font-bold text-slate-900" dir="ltr">{currentAuditIter.totalSum.toString()}</span>
                    </div>
                  </div>

                  {/* جدول تفريغ الخطوات الست لكل حرف */}
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-100 font-bold text-slate-700">
                        <tr>
                          <th className="p-2 w-12 text-center">#</th>
                          <th className="p-2 w-14 text-center">الحرف</th>
                          <th className="p-2 text-center">خطوة 2 (i²/n)</th>
                          <th className="p-2 text-center">خطوة 3 (v2/S2×In)</th>
                          <th className="p-2 text-center">خطوة 5 (v3/v3L×100)</th>
                          <th className="p-2 text-center">خطوة 6 (الكسر النهائي)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.normalizedChars.map((ch, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2 text-center font-mono font-bold" dir="ltr">#{idx + 1}</td>
                            <td className="p-2 text-center font-bold text-slate-900">{ch}</td>
                            <td className="p-2 text-center font-mono" dir="ltr">{currentAuditIter.step2Fractions[idx]?.toString() || '-'}</td>
                            <td className="p-2 text-center font-mono" dir="ltr">{currentAuditIter.step3Fractions[idx]?.toString() || '-'}</td>
                            <td className="p-2 text-center font-mono" dir="ltr">{currentAuditIter.step5Fractions[idx]?.toString() || '-'}</td>
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
