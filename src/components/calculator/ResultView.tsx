'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FourIterationCalculationResult } from '@/types/math';
import {
  Sparkles,
  Check,
  CheckSquare,
  Square,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  Calculator,
  Layers,
  HelpCircle,
  Eye,
  EyeOff,
  Hash,
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
  // Collapsible state for audit / 6 steps breakdown
  const [showAuditDetails, setShowAuditDetails] = useState(false);
  const [auditIterationTab, setAuditIterationTab] = useState<number>(4);

  if (!result) {
    return null;
  }

  const { visibleIteration, resultRows, transferredSqrtResult } = result;
  const transferredCount = result.transferredCount;
  const totalCount = result.totalChars;

  // Render dotted digits display for the 10 decimals after the dot
  const renderDottedDigits = (intPart: string, first10Digits: string) => {
    const digits = first10Digits.split('');
    return (
      <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-wrap items-center justify-center gap-2 font-mono text-sm sm:text-base dir-ltr shadow-inner">
        <span className="text-slate-300 font-bold">{intPart}.</span>
        <div className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          {digits.map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mb-0.5 shadow-[0_0_4px_rgba(251,191,36,0.9)]" />
              <span className="text-amber-300 font-black">{digit}</span>
            </div>
          ))}
        </div>
        <span className="text-slate-400 font-medium tracking-widest">...</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 dir-rtl font-cairo w-full min-w-0 animate-in fade-in duration-300">
      {/* ============================================================ */}
      {/* 1. مسار تسلسل الدورات الأربعة (4-Iteration Pipeline Stepper)     */}
      {/* ============================================================ */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-800">
                مسار الدورات الأربعة المتتابعة (4-Iteration Pipeline)
              </CardTitle>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
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
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      دورة #{iter.iterationIndex}
                    </span>
                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[10px] text-blue-800 font-bold">
                        <Eye className="w-3 h-3" />
                        الظاهر
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <EyeOff className="w-3 h-3" />
                        مخفي
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 font-medium">
                    المدخل: <span className="font-bold font-mono text-slate-900">{iter.inputVal}</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500">مجموع 10 أرقام:</span>
                    <span
                      className={`font-mono font-black ${
                        isCurrent ? 'text-blue-900 text-sm' : 'text-slate-800'
                      }`}
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
      {/* 2. القسم الرابع - الظاهر والتفاعلي (Interactive Result Rows) */}
      {/* ============================================================ */}
      <Card className="bg-white border-2 border-slate-300 shadow-md overflow-hidden">
        <CardHeader className="py-4 px-4 sm:px-6 bg-slate-50/80 border-b border-slate-200 flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                القسم الرابع - الظاهر (النتائج الكسرية المعتمدة)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              انقر على &quot;زر انتقال&quot; بجوار أي كسر لضمه أو استبعاده لحظياً من المجموع والجذر النهائي
            </p>
          </div>

          {/* Quick Selection Controls Toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              className="text-xs h-8 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
            >
              <CheckSquare className="w-3.5 h-3.5 ml-1 text-emerald-600" />
              تحديد الكل
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              className="text-xs h-8 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
            >
              <Square className="w-3.5 h-3.5 ml-1 text-slate-400" />
              إلغاء التحديد
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onInvertSelection}
              className="text-xs h-8 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 ml-1 text-blue-600" />
              عكس
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Distinct Result Rows with Adjacent Transfer Buttons */}
          <div className="space-y-2.5">
            {resultRows.map((row, idx) => {
              const isChecked = row.isTransferred;
              return (
                <div
                  key={`row-${row.pos}-${idx}`}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 opacity-60'
                  }`}
                >
                  {/* Left (RTL Right): Slot Info & Letter Badge */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-[9px] text-slate-500 font-bold">#{row.pos}</span>
                      <span className="text-base font-black text-slate-900 leading-none">
                        {row.char}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs text-slate-500 font-medium">
                        الخانة رقم {row.pos} (الحرف &quot;{row.char}&quot;)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        المدخل الأصلي: {row.originalChar}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Exact Fractional Result ($Final_R$, $Final_M$, $Final_L$) */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="text-left bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-inner flex items-baseline gap-2">
                      <span className="text-[11px] text-slate-500 font-bold">الكسر النهائي:</span>
                      <span
                        dir="ltr"
                        className="font-mono text-base sm:text-lg font-black text-slate-900"
                      >
                        {row.finalFractionDisplay}
                      </span>
                    </div>

                    {/* Adjacent Transfer Button (زر انتقال) */}
                    <Button
                      type="button"
                      onClick={() => onToggleTransfer?.(idx)}
                      className={`h-10 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 flex-shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/20'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {isChecked ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>منتقلة ✓</span>
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

          {/* ============================================================ */}
          {/* 3. مجموع الخانات المنتقلة (Transferred Sum)                 */}
          {/* ============================================================ */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-700" />
                مجموع الخانات المنتقلة المعتمدة ({transferredCount} من {totalCount}):
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {resultRows
                  .filter(r => r.isTransferred)
                  .map(r => r.finalFractionDisplay)
                  .join(' + ') || '0'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-600 font-semibold">المجموع الكسري التام:</span>
              <span
                dir="ltr"
                className="font-mono text-lg font-black text-blue-900 bg-blue-50 px-3 py-0.5 rounded-md border border-blue-200"
              >
                {result.transferredSumDisplay}
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 4. الجذر التربيعي وأول 10 أرقام منقطة                       */}
          {/* ============================================================ */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-amber-600" />
                الجذر التربيعي وأول 10 أرقام بعد الفاصلة (Dotted Digits):
              </span>
              <span dir="ltr" className="text-xs font-mono font-bold text-slate-600">
                √({result.transferredSumDisplay})
              </span>
            </div>

            {/* Dotted Digits Rendering */}
            {renderDottedDigits(
              transferredSqrtResult.intPart,
              transferredSqrtResult.first10AfterDot
            )}

            <div className="text-[11px] text-slate-500 text-center font-medium">
              الأرقام العشرة المستخرجة: [{transferredSqrtResult.digitsList.join(', ')}]
            </div>
          </div>

          {/* ============================================================ */}
          {/* 5. البطاقة التلخيصية الكبرى للناتج النهائي (38 Summary Card) */}
          {/* ============================================================ */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  الناتج الرقمي الإجمالي المعتمد
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  مجموع الأرقام العشرة بعد الفاصلة للدورة الرابعة
                </h3>
                <p className="text-xs text-slate-400 max-w-md">
                  حساب مجموع الأرقام العشرة المستخرجة من جذر مجموع الخانات المنتقلة
                </p>
              </div>

              {/* Huge High-Contrast Badge */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="bg-slate-950/80 border-2 border-emerald-500 px-5 sm:px-7 py-3 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    الناتج النهائي
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                    {result.final10DigitSum}
                  </span>
                </div>

                {/* Single Digit Reduction */}
                {result.reductionSteps.length > 1 && (
                  <div className="bg-slate-950/60 border border-slate-700 px-3 py-2 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-[9px] text-slate-400 font-bold">المفرد</span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {result.finalSingleDigit}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {result.reductionSteps.join('➔')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 6. قسم مراجعة الخطوات الست وتدقيق الحساب (Audit Accordion)   */}
      {/* ============================================================ */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAuditDetails(!showAuditDetails)}
          className="w-full py-3 px-4 sm:px-6 bg-slate-50/60 hover:bg-slate-100/60 transition-colors flex items-center justify-between text-right border-none cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-700" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              التفاصيل الرياضية للخطوات الست والدورات الأربعة (Mathematical Audit)
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
            {/* Iteration Selector Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
              {result.iterations.map(iter => (
                <Button
                  key={`tab-${iter.iterationIndex}`}
                  type="button"
                  variant={auditIterationTab === iter.iterationIndex ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAuditIterationTab(iter.iterationIndex)}
                  className={`text-xs h-8 px-3 rounded-lg ${
                    auditIterationTab === iter.iterationIndex
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  الدورة #{iter.iterationIndex} {iter.iterationIndex === 4 ? '(الظاهر)' : '(المخفي)'}
                </Button>
              ))}
            </div>

            {/* Audit Content for Selected Iteration */}
            {(() => {
              const activeIter =
                result.iterations.find(it => it.iterationIndex === auditIterationTab) ||
                visibleIteration;

              return (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">مدخل الدورة:</span>
                      <span className="font-bold font-mono text-slate-900 text-sm">
                        {activeIter.inputVal}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">مجموع الخطوة 2 (S2):</span>
                      <span className="font-bold font-mono text-slate-900 text-sm">
                        {activeIter.sum2.toString()}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">مجموع الخطوة 5 (S5):</span>
                      <span className="font-bold font-mono text-slate-900 text-sm">
                        {activeIter.sum5.toString()}
                      </span>
                    </div>
                  </div>

                  {/* 6 Steps Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 text-[11px] border-b border-slate-200 font-bold">
                          <th className="p-2 border-l border-slate-200">الخانة</th>
                          <th className="p-2 border-l border-slate-200">الحرف</th>
                          <th className="p-2 border-l border-slate-200">خطوة 2 (i²÷n)</th>
                          <th className="p-2 border-l border-slate-200">خطوة 3 (Base)</th>
                          <th className="p-2 border-l border-slate-200">خطوة 4 (المجموعة)</th>
                          <th className="p-2 border-l border-slate-200">خطوة 5 (النسبة)</th>
                          <th className="p-2 border-l border-slate-200">خطوة 6 (%)</th>
                          <th className="p-2">الناتج النهائي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono text-xs">
                        {result.normalizedChars.map((ch, idx) => {
                          const v2 = activeIter.step2Fractions[idx];
                          const v3 = activeIter.step3Fractions[idx];
                          const v4 = activeIter.charGroups[ch];
                          const v5 = activeIter.step5Fractions[idx];
                          const v6Ratio = activeIter.step6RatioFractions[idx];
                          const finalV = activeIter.finalFractions[idx];

                          return (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 border-l border-slate-200 font-bold">#{idx + 1}</td>
                              <td className="p-2 border-l border-slate-200 font-sans font-bold">{ch}</td>
                              <td className="p-2 border-l border-slate-200" dir="ltr">{v2?.toString()}</td>
                              <td className="p-2 border-l border-slate-200" dir="ltr">{v3?.toString()}</td>
                              <td className="p-2 border-l border-slate-200 font-bold text-blue-800" dir="ltr">{v4?.toString()}</td>
                              <td className="p-2 border-l border-slate-200" dir="ltr">{v5?.toString()}</td>
                              <td className="p-2 border-l border-slate-200 text-slate-600" dir="ltr">{v6Ratio?.toString()}%</td>
                              <td className="p-2 font-black text-slate-900 bg-slate-50" dir="ltr">{finalV?.toString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <span className="font-semibold text-slate-700">مجموع نواتج هذه الدورة:</span>
                    <span dir="ltr" className="font-mono font-bold text-slate-900">
                      {activeIter.totalSum.toString()}
                    </span>
                    <span className="text-slate-500">الجذر:</span>
                    <span dir="ltr" className="font-mono text-slate-700">
                      {activeIter.sqrtResult.fullString.substring(0, 16)}...
                    </span>
                    <span className="font-bold text-blue-800">
                      بذرة الدورة التالية = {activeIter.extracted10DigitSum}
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
