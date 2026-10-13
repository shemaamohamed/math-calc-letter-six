'use client';

import { useState, useCallback } from 'react';
import { calculateFourIterations } from '@/lib/calculate';
import { FourIterationCalculationResult } from '@/types/math';

export interface UseWordCalculatorReturn {
  text: string;
  setText: (val: string) => void;
  result: FourIterationCalculationResult | null;
  error: string;
  isCalculating: boolean;
  transferredIndices: number[];
  calculate: (customText?: string, customIndices?: number[]) => void;
  toggleSlot: (index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  invertSelection: () => void;
  reset: () => void;
}

/**
 * Custom React Hook for 4-Iteration Arabic Numerology Calculator
 * يدير تنفيذ الدورات الأربعة، والتحكم التفاعلي في أزرار الانتقال (Transfer Buttons)
 */
export function useWordCalculator(initialText = ''): UseWordCalculatorReturn {
  const [text, setTextState] = useState(initialText);
  const [result, setResult] = useState<FourIterationCalculationResult | null>(null);
  const [transferredIndices, setTransferredIndices] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const setText = useCallback((newText: string) => {
    setTextState(newText);
    setError('');
    setTransferredIndices([]);
  }, []);

  const calculate = useCallback(
    (customText?: string, customIndices?: number[]) => {
      const targetText = customText !== undefined ? customText : text;
      setError('');

      if (!targetText.trim()) {
        setError('الرجاء إدخال نص عربي لبدء الحساب');
        return;
      }

      setIsCalculating(true);

      // Instant execution with a micro-timeout for smooth UI state reflection
      setTimeout(() => {
        try {
          const activeIndices =
            customIndices !== undefined
              ? customIndices
              : transferredIndices.length > 0
              ? transferredIndices
              : undefined;

          const calcResult = calculateFourIterations(targetText, activeIndices);
          setResult(calcResult);
          setTransferredIndices(
            calcResult.resultRows.filter(r => r.isTransferred).map(r => r.pos - 1)
          );
        } catch (err) {
          setError(err instanceof Error ? err.message : 'حدث خطأ في عملية الحساب');
        } finally {
          setIsCalculating(false);
        }
      }, 50);
    },
    [text, transferredIndices]
  );

  const toggleSlot = useCallback(
    (index: number) => {
      if (!result) return;
      const current = result.resultRows.filter(r => r.isTransferred).map(r => r.pos - 1);
      const next = current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index];

      setTransferredIndices(next);
      try {
        const updated = calculateFourIterations(text, next);
        setResult(updated);
      } catch (err) {
        console.error('Error toggling slot:', err);
      }
    },
    [result, text]
  );

  const selectAll = useCallback(() => {
    if (!result) return;
    const all = result.resultRows.map((_, i) => i);
    setTransferredIndices(all);
    try {
      const updated = calculateFourIterations(text, all);
      setResult(updated);
    } catch (err) {
      console.error('Error selecting all:', err);
    }
  }, [result, text]);

  const deselectAll = useCallback(() => {
    if (!result) return;
    setTransferredIndices([]);
    try {
      const updated = calculateFourIterations(text, []);
      setResult(updated);
    } catch (err) {
      console.error('Error deselecting all:', err);
    }
  }, [result, text]);

  const invertSelection = useCallback(() => {
    if (!result) return;
    const current = result.resultRows.filter(r => r.isTransferred).map(r => r.pos - 1);
    const inverted = result.resultRows
      .map((_, i) => i)
      .filter(i => !current.includes(i));

    setTransferredIndices(inverted);
    try {
      const updated = calculateFourIterations(text, inverted);
      setResult(updated);
    } catch (err) {
      console.error('Error inverting selection:', err);
    }
  }, [result, text]);

  const reset = useCallback(() => {
    setTextState('');
    setResult(null);
    setTransferredIndices([]);
    setError('');
  }, []);

  return {
    text,
    setText,
    result,
    error,
    isCalculating,
    transferredIndices,
    calculate,
    toggleSlot,
    selectAll,
    deselectAll,
    invertSelection,
    reset,
  };
}
