'use client';

import { useState, useCallback } from 'react';
import { calculateTwoPhases } from '@/lib/calculate';
import { TwoPhaseCalculationResult } from '@/types/math';

export interface BaseRatioState {
  num: string;
  den: string;
}

export interface UseWordCalculatorReturn {
  text: string;
  setText: (val: string) => void;
  result: TwoPhaseCalculationResult | null;
  error: string;
  isCalculating: boolean;
  transferredIndices: number[];
  baseRatio: BaseRatioState;
  setBaseRatio: (val: BaseRatioState) => void;
  isCustomRatioActive: boolean;
  setIsCustomRatioActive: (val: boolean) => void;
  updateNumerator: (num: string) => void;
  updateDenominator: (den: string) => void;
  toggleCustomRatio: () => void;
  applyCustomRatio: () => void;
  calculate: (
    customText?: string,
    customIndices?: number[],
    customRatio?: BaseRatioState,
    customActive?: boolean
  ) => void;
  toggleSlot: (index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  invertSelection: () => void;
  reset: () => void;
}

/**
 * Custom React Hook for 2-Phase Arabic Numerology Calculator
 * يدير تنفيذ القسمين (المخفي بالنسبة الكسرية المحددة، والظاهر)، والتحكم التفاعلي في أزرار الانتقال والنسبة
 */
export function useWordCalculator(initialText = ''): UseWordCalculatorReturn {
  const [text, setTextState] = useState(initialText);
  const [result, setResult] = useState<TwoPhaseCalculationResult | null>(null);
  const [transferredIndices, setTransferredIndices] = useState<number[]>([]);
  const [baseRatio, setBaseRatio] = useState<BaseRatioState>({
    num: '5329',
    den: '1',
  });
  const [isCustomRatioActive, setIsCustomRatioActive] = useState<boolean>(true);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const setText = useCallback((newText: string) => {
    setTextState(newText);
    setError('');
    setTransferredIndices([]);
  }, []);

  const calculate = useCallback(
    (
      customText?: string,
      customIndices?: number[],
      customRatio?: BaseRatioState,
      customActive?: boolean
    ) => {
      const targetText = customText !== undefined ? customText : text;
      setError('');

      if (!targetText.trim()) {
        setError('الرجاء إدخال نص عربي لبدء الحساب');
        return;
      }

      setIsCalculating(true);

      const activeRatioState = customRatio !== undefined ? customRatio : baseRatio;
      const activeState = customActive !== undefined ? customActive : isCustomRatioActive;

      // إذا كانت النسبة مفعلة نستخدم الكسر المحدد، وإلا نستخدم الافتراضي (5329/1)
      const ratioToUse = activeState
        ? {
            num: activeRatioState.num.trim() || '5329',
            den: activeRatioState.den.trim() || '1',
          }
        : { num: '5329', den: '1' };

      // Instant execution with a micro-timeout for smooth UI state reflection
      setTimeout(() => {
        try {
          const activeIndices =
            customIndices !== undefined
              ? customIndices
              : transferredIndices.length > 0
              ? transferredIndices
              : undefined;

          const calcResult = calculateTwoPhases(targetText, activeIndices, ratioToUse);
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
    [text, transferredIndices, baseRatio, isCustomRatioActive]
  );

  const updateNumerator = useCallback(
    (num: string) => {
      const newRatio = { ...baseRatio, num };
      setBaseRatio(newRatio);
      if (text.trim() && result) {
        calculate(text, transferredIndices, newRatio, isCustomRatioActive);
      }
    },
    [baseRatio, text, result, transferredIndices, isCustomRatioActive, calculate]
  );

  const updateDenominator = useCallback(
    (den: string) => {
      const newRatio = { ...baseRatio, den };
      setBaseRatio(newRatio);
      if (text.trim() && result) {
        calculate(text, transferredIndices, newRatio, isCustomRatioActive);
      }
    },
    [baseRatio, text, result, transferredIndices, isCustomRatioActive, calculate]
  );

  const toggleCustomRatio = useCallback(() => {
    const nextActive = !isCustomRatioActive;
    setIsCustomRatioActive(nextActive);
    if (text.trim() && result) {
      calculate(text, transferredIndices, baseRatio, nextActive);
    }
  }, [isCustomRatioActive, text, result, transferredIndices, baseRatio, calculate]);

  const applyCustomRatio = useCallback(() => {
    if (text.trim()) {
      calculate(text, transferredIndices, baseRatio, isCustomRatioActive);
    }
  }, [text, transferredIndices, baseRatio, isCustomRatioActive, calculate]);

  const toggleSlot = useCallback(
    (index: number) => {
      if (!result) return;
      const current = result.resultRows.filter(r => r.isTransferred).map(r => r.pos - 1);
      const next = current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index];

      setTransferredIndices(next);
      try {
        const ratioToUse = isCustomRatioActive
          ? { num: baseRatio.num || '5329', den: baseRatio.den || '1' }
          : { num: '5329', den: '1' };
        const updated = calculateTwoPhases(text, next, ratioToUse);
        setResult(updated);
      } catch (err) {
        console.error('Error toggling slot:', err);
      }
    },
    [result, text, baseRatio, isCustomRatioActive]
  );

  const selectAll = useCallback(() => {
    if (!result) return;
    const all = result.resultRows.map((_, i) => i);
    setTransferredIndices(all);
    try {
      const ratioToUse = isCustomRatioActive
        ? { num: baseRatio.num || '5329', den: baseRatio.den || '1' }
        : { num: '5329', den: '1' };
      const updated = calculateTwoPhases(text, all, ratioToUse);
      setResult(updated);
    } catch (err) {
      console.error('Error selecting all:', err);
    }
  }, [result, text, baseRatio, isCustomRatioActive]);

  const deselectAll = useCallback(() => {
    if (!result) return;
    setTransferredIndices([]);
    try {
      const ratioToUse = isCustomRatioActive
        ? { num: baseRatio.num || '5329', den: baseRatio.den || '1' }
        : { num: '5329', den: '1' };
      const updated = calculateTwoPhases(text, [], ratioToUse);
      setResult(updated);
    } catch (err) {
      console.error('Error deselecting all:', err);
    }
  }, [result, text, baseRatio, isCustomRatioActive]);

  const invertSelection = useCallback(() => {
    if (!result) return;
    const current = result.resultRows.filter(r => r.isTransferred).map(r => r.pos - 1);
    const inverted = result.resultRows
      .map((_, i) => i)
      .filter(i => !current.includes(i));

    setTransferredIndices(inverted);
    try {
      const ratioToUse = isCustomRatioActive
        ? { num: baseRatio.num || '5329', den: baseRatio.den || '1' }
        : { num: '5329', den: '1' };
      const updated = calculateTwoPhases(text, inverted, ratioToUse);
      setResult(updated);
    } catch (err) {
      console.error('Error inverting selection:', err);
    }
  }, [result, text, baseRatio, isCustomRatioActive]);

  const reset = useCallback(() => {
    setTextState('');
    setResult(null);
    setTransferredIndices([]);
    setBaseRatio({ num: '5329', den: '1' });
    setIsCustomRatioActive(true);
    setError('');
  }, []);

  return {
    text,
    setText,
    result,
    error,
    isCalculating,
    transferredIndices,
    baseRatio,
    setBaseRatio,
    isCustomRatioActive,
    setIsCustomRatioActive,
    updateNumerator,
    updateDenominator,
    toggleCustomRatio,
    applyCustomRatio,
    calculate,
    toggleSlot,
    selectAll,
    deselectAll,
    invertSelection,
    reset,
  };
}
