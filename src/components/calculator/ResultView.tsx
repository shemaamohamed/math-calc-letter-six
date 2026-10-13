'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FourIterationCalculationResult } from '@/types/math';
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
  FileSpreadsheet,
} from 'lucide-react';

interface ResultViewProps {
  result: FourIterationCalculationResult | null;
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
  // حالة الطي/الفتح لجدول التدقيق الرياضي الشامل
  const [showAuditDetails, setShowAuditDetails] = useState(false);
  const [auditIterationTab, setAuditIterationTab] = useState<number>(4);

  if (!result) {
    return null;
  }

  const { visibleIteration, resultRows, transferredSqrtResult } = result;
  const transferredCount = result.transferredCount;
  const totalCount = result.totalChars;

  // عرض الأرقام العشرة المنقطة باتجاه LTR الرياضي المعزول تماماً
  const renderDottedDigits = (intPart: string, first10Digits: string) => {
    const digits = first10Digits.split('');
    return (
      <div
        dir="ltr"
        style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
        className="p-4 bg-white text-slate-900 rounded-xl border-2 border-slate-300 flex flex-wrap items-center justify-center gap-2.5 font-mono text-base sm:text-lg shadow-sm"
      >
        <span className="text-slate-950 font-black">{intPart}.</span>
        <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-inner">
          {digits.map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 mb-1 shadow-[0_0_4px_rgba(245,158,11,0.7)]" />
              <span className="text-slate-950 font-black">{digit}</span>
            </div>
          ))}
        </div>
        <span className="text-slate-400 font-bold tracking-widest">...</span>
      </div>
    );
  };

  return (
    <div className="space-y-5 dir-rtl font-cairo w-full min-w-0 animate-in fade-in duration-300" dir="rtl">
      {/* ============================================================ */}
      {/* 1. معاينة سريعة للناتج النهائي في أعلى النتائج                 */}
      {/* ============================================================ */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-blue-50/70 to-white border-2 border-emerald-400 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 flex-shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-black text-emerald-950">
                معاينة سريعة للناتج النهائي
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md font-bold border border-emerald-300">
                {transferredCount} من {totalCount} خانات منتقلة
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold flex items-center gap-2 flex-wrap">
              <span>
                المجموع الكسري:{' '}
                <strong className="font-mono text-slate-950 font-bold" dir="ltr">
                  {result.transferredSumDisplay}
                </strong>
              </span>
              <span className="text-slate-400">•</span>
              <span>
                الجذر:{' '}
                <strong className="font-mono text-slate-950 font-bold" dir="ltr">
                  {transferredSqrtResult.intPart}.{transferredSqrtResult.first10AfterDot.substring(0, 5)}...
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="px-5 py-2.5 bg-white rounded-xl border-2 border-emerald-500 flex items-center gap-2.5 shadow-sm">
            <span className="text-xs font-bold text-slate-700">الناتج النهائي:</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tracking-tight" dir="ltr">
              {result.final10DigitSum}
            </span>
          </div>
          {result.reductionSteps.length > 1 && (
            <div className="px-3.5 py-2 bg-white rounded-xl border border-slate-300 flex items-center gap-1.5 shadow-sm">
              <span className="text-xs font-medium text-slate-600">المفرد:</span>
              <span className="font-black text-slate-950 font-mono text-base" dir="ltr">
                {result.finalSingleDigit}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. مسار تسلسل الدورات الأربعة المتتابعة                        */}
      {/* ============================================================ */}
      <Card className="bg-white border-2 border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="py-3.5 px-4 sm:px-6 bg-slate-50/80 border-b border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <CardTitle className="text-xs sm:text-sm font-black text-slate-900">
                مسار الدورات الأربعة المتتابعة
              </CardTitle>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white px-3 py-0.5 rounded-full border border-slate-200">
              3 دورات مخفية ➔ الدورة الرابعة الظاهرة
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {result.iterations.map((iter, idx) => {
              const isCurrent = iter.iterationIndex === 4;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border-2 transition-all ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/10 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
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
                    المدخل الأساسي: <span className="font-bold font-mono text-slate-950 text-sm" dir="ltr">{iter.inputVal}</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between text-xs pt-1.5 border-t border-slate-200">
                    <span className="text-slate-600 font-medium">مجموع 10 أرقام:</span>
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
      {/* 3. القسم الرابع - الظاهر والتفاعلي                             */}
      {/* ============================================================ */}
      <Card className="bg-white border-2 border-slate-300 shadow-md overflow-hidden rounded-2xl">
        <CardHeader className="py-4 px-4 sm:px-6 bg-slate-50/90 border-b border-slate-200 flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-slate-950">
                القسم الرابع - الظاهر (النتائج الكسرية المعتمدة)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              يمكنك النقر على أي سطر بالكامل لتبديل حالة النقل والتحديد لحظياً
            </p>
          </div>

          {/* أزرار التحكم السريع بالتحديد */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              className="text-xs h-8 px-2.5 bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-bold cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 ml-1 text-emerald-600" />
              تحديد الكل
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              className="text-xs h-8 px-2.5 bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-bold cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 ml-1 text-slate-400" />
              إلغاء التحديد
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onInvertSelection}
              className="text-xs h-8 px-2.5 bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-bold cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 ml-1 text-blue-600" />
              عكس
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* أسطر النتائج - السطر كامل قابل للنقر مع زر انتقال بعلامة واحدة */}
          <div className="space-y-2.5">
            {resultRows.map((row, idx) => {
              const isChecked = row.isTransferred;
              return (
                <div
                  key={`row-${row.pos}-${idx}`}
                  onClick={() => onToggleTransfer?.(idx)}
                  className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-sm hover:bg-emerald-50'
                      : 'bg-white border-slate-200 opacity-60 hover:opacity-85 hover:border-slate-300'
                  }`}
                >
                  {/* بيانات الخانة والحرف */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-[10px] text-slate-500 font-bold" dir="ltr">#{row.pos}</span>
                      <span className="text-base font-black text-slate-900 leading-none">
                        {row.char}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm text-slate-900 font-bold">
                        الخانة رقم {row.pos} (الحرف &quot;{row.char}&quot;)
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        المدخل الأصلي: {row.originalChar}
                      </div>
                    </div>
                  </div>

                  {/* الكسر النهائي وزر الانتقال */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="text-left bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-inner flex items-baseline gap-2">
                      <span className="text-xs text-slate-600 font-bold">الكسر النهائي:</span>
                      <span
                        dir="ltr"
                        className="font-mono text-base sm:text-lg font-black text-slate-950 inline-block"
                      >
                        {row.finalFractionDisplay}
                      </span>
                    </div>

                    {/* زر انتقال مع علامة صح واحدة فقط بدون تكرار */}
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTransfer?.(idx);
                      }}
                      className={`h-10 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 flex-shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/20'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {isChecked ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>منتقلة</span>
                        </>
                      ) : (
                        <span>زر انتقال</span>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* مجموع الخانات المنتقلة */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-700" />
                مجموع الخانات المنتقلة المعتمدة ({transferredCount} من {totalCount}):
              </span>
              <span className="text-xs text-slate-600 font-mono font-bold" dir="ltr">
                {resultRows
                  .filter(r => r.isTransferred)
                  .map(r => r.finalFractionDisplay)
                  .join(' + ') || '0'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-xs sm:text-sm text-slate-700 font-bold">المجموع الكسري التام:</span>
              <span
                dir="ltr"
                className="font-mono text-lg font-black text-blue-950 bg-blue-50 px-3 py-0.5 rounded-md border border-blue-200 inline-block"
              >
                {result.transferredSumDisplay}
              </span>
            </div>
          </div>

          {/* الجذر التربيعي والأرقام المنقطة بعد الفاصلة في النمط الفاتح الكامل */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-amber-600" />
                الجذر التربيعي وأول 10 أرقام بعد الفاصلة:
              </span>
              <span dir="ltr" className="text-xs font-mono font-bold text-slate-700 inline-block">
                √({result.transferredSumDisplay})
              </span>
            </div>

            {/* الأرقام المنقطة في النمط الفاتح */}
            {renderDottedDigits(
              transferredSqrtResult.intPart,
              transferredSqrtResult.first10AfterDot
            )}

            <div className="text-xs text-slate-600 text-center font-mono font-bold" dir="ltr">
              [{transferredSqrtResult.digitsList.join(', ')}]
            </div>
          </div>

          {/* البطاقة التلخيصية الكبرى للناتج النهائي في النمط الفاتح النقي */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  الناتج الرقمي الإجمالي المعتمد
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-950">
                  مجموع الأرقام العشرة بعد الفاصلة للدورة الرابعة
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md">
                  حساب مجموع الأرقام العشرة المستخرجة من جذر مجموع الخانات المنتقلة
                </p>
              </div>

              {/* بطاقة الرقم النهائي البارزة */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="bg-emerald-50/90 border-2 border-emerald-500 px-6 sm:px-8 py-3 rounded-2xl flex flex-col items-center justify-center shadow-md">
                  <span className="text-[10px] text-emerald-900 uppercase tracking-widest font-bold">
                    الناتج النهائي
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono tracking-tight" dir="ltr">
                    {result.final10DigitSum}
                  </span>
                </div>

                {/* مسار الاختزال الرقمي إلى مفرد */}
                {result.reductionSteps.length > 1 && (
                  <div className="bg-slate-50 border border-slate-300 px-3.5 py-2.5 rounded-xl flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] text-slate-600 font-bold">المفرد</span>
                    <span className="text-lg font-black text-slate-950 font-mono" dir="ltr">
                      {result.finalSingleDigit}
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-bold" dir="ltr">
                      {result.reductionSteps.join(' ➔ ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 4. قسم التدقيق الرياضي الشامل للخطوات الست والدورات الأربعة   */}
      {/* ============================================================ */}
      <Card className="bg-white border-2 border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={() => setShowAuditDetails(!showAuditDetails)}
          className="w-full py-3.5 px-4 sm:px-6 bg-slate-50/80 hover:bg-slate-100 transition-colors flex items-center justify-between text-right border-none cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-700" />
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              التفاصيل الرياضية للخطوات الست والدورات الأربعة (التدقيق الشامل)
            </span>
          </div>
          {showAuditDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showAuditDetails && (
          <CardContent className="p-4 sm:p-6 space-y-4 border-t border-slate-200">
            {/* أزرار اختيار الدورة */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 overflow-x-auto">
              {result.iterations.map(iter => (
                <Button
                  key={`tab-${iter.iterationIndex}`}
                  type="button"
                  variant={auditIterationTab === iter.iterationIndex ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAuditIterationTab(iter.iterationIndex)}
                  className={`text-xs h-8 px-3 rounded-lg cursor-pointer font-bold ${
                    auditIterationTab === iter.iterationIndex
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  الدورة {iter.iterationIndex} {iter.iterationIndex === 4 ? '(الظاهر)' : '(المخفي)'}
                </Button>
              ))}
            </div>

            {/* محتوى التدقيق للدورة المختارة */}
            {(() => {
              const activeIter =
                result.iterations.find(it => it.iterationIndex === auditIterationTab) ||
                visibleIteration;

              return (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-600 block text-xs">مدخل الدورة:</span>
                      <span className="font-bold font-mono text-slate-950 text-base" dir="ltr">
                        {activeIter.inputVal}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-600 block text-xs">مجموع الخطوة 2:</span>
                      <span className="font-bold font-mono text-slate-950 text-base" dir="ltr">
                        {activeIter.sum2.toString()}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-600 block text-xs">مجموع الخطوة 5:</span>
                      <span className="font-bold font-mono text-slate-950 text-base" dir="ltr">
                        {activeIter.sum5.toString()}
                      </span>
                    </div>
                  </div>

                  {/* جدول الخطوات الست الكامل باللغة العربية الخالصة */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 text-xs border-b border-slate-200 font-black">
                          <th className="p-2.5 border-l border-slate-200">الخانة</th>
                          <th className="p-2.5 border-l border-slate-200">الحرف</th>
                          <th className="p-2.5 border-l border-slate-200">الخطوة 2 (الترتيب)</th>
                          <th className="p-2.5 border-l border-slate-200">الخطوة 3 (الأساس)</th>
                          <th className="p-2.5 border-l border-slate-200">الخطوة 4 (جمع المتماثل)</th>
                          <th className="p-2.5 border-l border-slate-200">الخطوة 5 (النسبة)</th>
                          <th className="p-2.5 border-l border-slate-200">الخطوة 6 (المئوية)</th>
                          <th className="p-2.5">الكسر النهائي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono text-xs sm:text-sm">
                        {result.normalizedChars.map((ch, idx) => {
                          const v2 = activeIter.step2Fractions[idx];
                          const v3 = activeIter.step3Fractions[idx];
                          const v4 = activeIter.charGroups[ch];
                          const v5 = activeIter.step5Fractions[idx];
                          const v6Ratio = activeIter.step6RatioFractions[idx];
                          const finalV = activeIter.finalFractions[idx];

                          return (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5 border-l border-slate-200 font-bold" dir="ltr">#{idx + 1}</td>
                              <td className="p-2.5 border-l border-slate-200 font-sans font-black text-slate-900">{ch}</td>
                              <td className="p-2.5 border-l border-slate-200" dir="ltr">{v2?.toString()}</td>
                              <td className="p-2.5 border-l border-slate-200" dir="ltr">{v3?.toString()}</td>
                              <td className="p-2.5 border-l border-slate-200 font-bold text-blue-900" dir="ltr">{v4?.toString()}</td>
                              <td className="p-2.5 border-l border-slate-200" dir="ltr">{v5?.toString()}</td>
                              <td className="p-2.5 border-l border-slate-200 text-slate-700" dir="ltr">{v6Ratio?.toString()}%</td>
                              <td className="p-2.5 font-black text-slate-950 bg-slate-50" dir="ltr">{finalV?.toString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="font-bold text-slate-800">مجموع نواتج هذه الدورة:</span>
                    <span dir="ltr" className="font-mono font-black text-slate-950">
                      {activeIter.totalSum.toString()}
                    </span>
                    <span className="text-slate-500 font-bold">•</span>
                    <span className="text-slate-700 font-medium">الجذر:</span>
                    <span dir="ltr" className="font-mono font-bold text-slate-900">
                      {activeIter.sqrtResult.fullString.substring(0, 16)}...
                    </span>
                    <span className="text-slate-500 font-bold">•</span>
                    <span className="font-bold text-blue-900">
                      بذرة الدورة التالية: <strong className="font-mono text-sm" dir="ltr">{activeIter.extracted10DigitSum}</strong>
                    </span>
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
