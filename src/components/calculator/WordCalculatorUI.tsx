'use client';

import React from 'react';
import { useWordCalculator } from '@/hooks/useWordCalculator';
import ArabicInput from './ArabicInput';
import ResultView from './ResultView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Calculator, Loader2 } from 'lucide-react';

interface WordCalculatorUIProps {
  initialText?: string;
}

export default function WordCalculatorUI({ initialText = '' }: WordCalculatorUIProps) {
  const {
    text,
    setText,
    result,
    error,
    isCalculating,
    calculate,
    toggleSlot,
    selectAll,
    deselectAll,
    invertSelection,
  } = useWordCalculator(initialText);

  return (
    <div className="w-full space-y-6 dir-rtl font-cairo">
      {/* 1. لوحة الإدخال والتحليل */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-700" />
            <CardTitle className="text-sm font-bold text-slate-800">
              لوحة الإدخال والتحليل الرقمي (4 دورات)
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <ArabicInput value={text} onChange={setText} />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-xs font-semibold text-center">{error}</p>
            </div>
          )}

          <Button
            onClick={() => calculate()}
            disabled={!text.trim() || isCalculating}
            className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-700/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="font-semibold text-white">جاري الحساب الكسري عبر 4 دورات...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>بدء الحساب الرقمي (Arbitrary-Precision)</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 2. قسم النتائج */}
      {result && (
        <ResultView
          result={result}
          onToggleTransfer={toggleSlot}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onInvertSelection={invertSelection}
        />
      )}
    </div>
  );
}
