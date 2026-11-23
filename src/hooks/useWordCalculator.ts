'use client';

import { useState, useCallback } from 'react';
import { calculateMultiSection, BASE_VALUE } from '@/lib/calculate';
import { MultiSectionCalculationResult, TwoPhaseCalculationResult } from '@/types/math';

export interface BaseRatioState {
  num: string;
  den: string;
}

export interface UseWordCalculatorReturn {
  text: string;
  setText: (val: string) => void;
  result: MultiSectionCalculationResult | null;
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
    customSectionsSelected?: number[][],
    customRatio?: BaseRatioState,
    customActive?: boolean,
    customSectionsCount?: number,
    customActiveIndex?: number
  ) => void;
  toggleSlot: (index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  invertSelection: () => void;
  reset: () => void;
  
  // 🔵 إدارة الأقسام المتتابعة (زر إضافة قسم والتنقل)
  totalSectionsCount: number;
  activeSectionIndex: number;
  addSection: () => void;
  removeLastSection: () => void;
  setActiveSection: (index: number) => void;
}

/**
 * Custom React Hook for Multi-Section Dynamic Letter & Fraction Calculation Engine
 * يدير الحساب المتتابع عبر الأقسام اللانهائية مع عرض القسم الحالي فقط
 */
export function useWordCalculator(initialText = ''): UseWordCalculatorReturn {
  const [text, setTextState] = useState(initialText);
  const [result, setResult] = useState<MultiSectionCalculationResult | null>(null);
  const [totalSectionsCount, setTotalSectionsCount] = useState<number>(1);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(1);
  const [sectionsSelections, setSectionsSelections] = useState<number[][]>([]);
  
  const [baseRatio, setBaseRatio] = useState<BaseRatioState>({
    num: BASE_VALUE.toString(),
    den: '1',
  });
  const [isCustomRatioActive, setIsCustomRatioActive] = useState<boolean>(true);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const setText = useCallback((newText: string) => {
    setTextState(newText);
    setError('');
    setSectionsSelections([]);
    setTotalSectionsCount(1);
    setActiveSectionIndex(1);
  }, []);

  const calculate = useCallback(
    (
      customText?: string,
      customSectionsSelected?: number[][],
      customRatio?: BaseRatioState,
      customActive?: boolean,
      customSectionsCount?: number,
      customActiveIndex?: number
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
      const sectionsCount = customSectionsCount !== undefined ? customSectionsCount : totalSectionsCount;
      const targetActiveIndex = customActiveIndex !== undefined ? customActiveIndex : activeSectionIndex;
      const selectionsToUse = customSectionsSelected !== undefined ? customSectionsSelected : sectionsSelections;

      // إذا كانت النسبة مفعلة نستخدم الكسر المحدد، وإلا نستخدم الافتراضي (80/1)
      const ratioToUse = activeState
        ? {
            num: activeRatioState.num.trim() || BASE_VALUE.toString(),
            den: activeRatioState.den.trim() || '1',
          }
        : { num: BASE_VALUE.toString(), den: '1' };

      setTimeout(() => {
        try {
          const calcResult = calculateMultiSection(
            targetText,
            ratioToUse,
            selectionsToUse,
            sectionsCount,
            targetActiveIndex
          );
          setResult(calcResult);
          setTotalSectionsCount(calcResult.totalSectionsCount);
          setActiveSectionIndex(calcResult.currentSectionIndex);

          // مزامنة التحديدات لكل قسم
          const updatedSelections = calcResult.sections.map(s => s.selectedIndices);
          setSectionsSelections(updatedSelections);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'حدث خطأ في عملية الحساب');
        } finally {
          setIsCalculating(false);
        }
      }, 50);
    },
    [text, sectionsSelections, baseRatio, isCustomRatioActive, totalSectionsCount, activeSectionIndex]
  );

  const updateNumerator = useCallback(
    (num: string) => {
      const newRatio = { ...baseRatio, num };
      setBaseRatio(newRatio);
      if (text.trim() && result) {
        calculate(text, sectionsSelections, newRatio, isCustomRatioActive, totalSectionsCount, activeSectionIndex);
      }
    },
    [baseRatio, text, result, sectionsSelections, isCustomRatioActive, totalSectionsCount, activeSectionIndex, calculate]
  );

  const updateDenominator = useCallback(
    (den: string) => {
      const newRatio = { ...baseRatio, den };
      setBaseRatio(newRatio);
      if (text.trim() && result) {
        calculate(text, sectionsSelections, newRatio, isCustomRatioActive, totalSectionsCount, activeSectionIndex);
      }
    },
    [baseRatio, text, result, sectionsSelections, isCustomRatioActive, totalSectionsCount, activeSectionIndex, calculate]
  );

  const toggleCustomRatio = useCallback(() => {
    const nextActive = !isCustomRatioActive;
    setIsCustomRatioActive(nextActive);
    if (text.trim() && result) {
      calculate(text, sectionsSelections, baseRatio, nextActive, totalSectionsCount, activeSectionIndex);
    }
  }, [isCustomRatioActive, text, result, sectionsSelections, baseRatio, totalSectionsCount, activeSectionIndex, calculate]);

  const applyCustomRatio = useCallback(() => {
    if (text.trim()) {
      calculate(text, sectionsSelections, baseRatio, isCustomRatioActive, totalSectionsCount, activeSectionIndex);
    }
  }, [text, sectionsSelections, baseRatio, isCustomRatioActive, totalSectionsCount, activeSectionIndex, calculate]);

  // 🔵 تبديل حالة خانة بزر انتقال الخانات في القسم المعروض حالياً
  const toggleSlot = useCallback(
    (slotIndex: number) => {
      if (!result) return;
      const currentSection = result.currentSection;
      const currentSelected = currentSection.selectedIndices;
      const nextSelected = currentSelected.includes(slotIndex)
        ? currentSelected.filter(i => i !== slotIndex)
        : [...currentSelected, slotIndex].sort((a, b) => a - b);

      const secIdx0 = result.currentSectionIndex - 1;
      const nextSectionsSelections = [...sectionsSelections];
      nextSectionsSelections[secIdx0] = nextSelected;
      setSectionsSelections(nextSectionsSelections);

      try {
        const ratioToUse = isCustomRatioActive
          ? { num: baseRatio.num || BASE_VALUE.toString(), den: baseRatio.den || '1' }
          : { num: BASE_VALUE.toString(), den: '1' };

        const updated = calculateMultiSection(
          text,
          ratioToUse,
          nextSectionsSelections,
          totalSectionsCount,
          activeSectionIndex
        );
        setResult(updated);
      } catch (err) {
        console.error('Error toggling slot:', err);
      }
    },
    [result, text, baseRatio, isCustomRatioActive, sectionsSelections, totalSectionsCount, activeSectionIndex]
  );

  const selectAll = useCallback(() => {
    if (!result) return;
    const all = result.currentSection.rows.map((_, i) => i);
    const secIdx0 = result.currentSectionIndex - 1;
    const nextSectionsSelections = [...sectionsSelections];
    nextSectionsSelections[secIdx0] = all;
    setSectionsSelections(nextSectionsSelections);

    try {
      const ratioToUse = isCustomRatioActive
        ? { num: baseRatio.num || BASE_VALUE.toString(), den: baseRatio.den || '1' }
        : { num: BASE_VALUE.toString(), den: '1' };

      const updated = calculateMultiSection(
        text,
        ratioToUse,
        nextSectionsSelections,
        totalSectionsCount,
        activeSectionIndex
      );
      setResult(updated);
    } catch (err) {
      console.error('Error selecting all:', err);
    }
  }, [result, text, baseRatio, isCustomRatioActive, sectionsSelections, totalSectionsCount, activeSectionIndex]);

  const deselectAll = useCallback(() => {
    if (!result) return;
    const secIdx0 = result.currentSectionIndex - 1;
    const nextSectionsSelections = [...sectionsSelections];
    nextSectionsSelections[secIdx0] = [];
    setSectionsSelections(nextSectionsSelections);

    try {
      const ratioToUse = isCustomRatioActive
        ? { num: baseRatio.num || BASE_VALUE.toString(), den: baseRatio.den || '1' }
        : { num: BASE_VALUE.toString(), den: '1' };

      const updated = calculateMultiSection(
        text,
        ratioToUse,
        nextSectionsSelections,
        totalSectionsCount,
        activeSectionIndex
      );
      setResult(updated);
    } catch (err) {
      console.error('Error deselecting all:', err);
    }
  }, [result, text, baseRatio, isCustomRatioActive, sectionsSelections, totalSectionsCount, activeSectionIndex]);

  const invertSelection = useCallback(() => {
    if (!result) return;
    const current = result.currentSection.selectedIndices;
    const inverted = result.currentSection.rows
      .map((_, i) => i)
      .filter(i => !current.includes(i));

    const secIdx0 = result.currentSectionIndex - 1;
    const nextSectionsSelections = [...sectionsSelections];
    nextSectionsSelections[secIdx0] = inverted;
    setSectionsSelections(nextSectionsSelections);

    try {
      const ratioToUse = isCustomRatioActive
        ? { num: baseRatio.num || BASE_VALUE.toString(), den: baseRatio.den || '1' }
        : { num: BASE_VALUE.toString(), den: '1' };

      const updated = calculateMultiSection(
        text,
        ratioToUse,
        nextSectionsSelections,
        totalSectionsCount,
        activeSectionIndex
      );
      setResult(updated);
    } catch (err) {
      console.error('Error inverting selection:', err);
    }
  }, [result, text, baseRatio, isCustomRatioActive, sectionsSelections, totalSectionsCount, activeSectionIndex]);

  // 🔵 زر إضافة قسم جديد: يرحل ناتج القسم السابق، ويُخفي القسم السابق ويُظهر القسم الجديد فقط
  const addSection = useCallback(() => {
    if (!text.trim() || !result) return;
    const nextCount = totalSectionsCount + 1;
    const nextActiveIndex = nextCount;

    setTotalSectionsCount(nextCount);
    setActiveSectionIndex(nextActiveIndex);

    // الخانات للقسم الجديد تكون افتراضياً كافة الخانات
    const nextSelections = [...sectionsSelections];
    nextSelections[nextCount - 1] = result.normalizedChars.map((_, i) => i);
    setSectionsSelections(nextSelections);

    calculate(text, nextSelections, baseRatio, isCustomRatioActive, nextCount, nextActiveIndex);
  }, [text, result, totalSectionsCount, sectionsSelections, baseRatio, isCustomRatioActive, calculate]);

  // حذف آخر قسم والرجوع للقسم السابق
  const removeLastSection = useCallback(() => {
    if (totalSectionsCount <= 1) return;
    const nextCount = totalSectionsCount - 1;
    const nextActiveIndex = Math.min(activeSectionIndex, nextCount);

    setTotalSectionsCount(nextCount);
    setActiveSectionIndex(nextActiveIndex);

    const nextSelections = sectionsSelections.slice(0, nextCount);
    setSectionsSelections(nextSelections);

    calculate(text, nextSelections, baseRatio, isCustomRatioActive, nextCount, nextActiveIndex);
  }, [totalSectionsCount, activeSectionIndex, sectionsSelections, text, baseRatio, isCustomRatioActive, calculate]);

  // التنقل لعرض قسم معين فقط
  const setActiveSection = useCallback(
    (targetIdx: number) => {
      if (targetIdx < 1 || targetIdx > totalSectionsCount) return;
      setActiveSectionIndex(targetIdx);
      if (result) {
        calculate(text, sectionsSelections, baseRatio, isCustomRatioActive, totalSectionsCount, targetIdx);
      }
    },
    [totalSectionsCount, result, text, sectionsSelections, baseRatio, isCustomRatioActive, calculate]
  );

  const reset = useCallback(() => {
    setTextState('');
    setResult(null);
    setTotalSectionsCount(1);
    setActiveSectionIndex(1);
    setSectionsSelections([]);
    setBaseRatio({ num: BASE_VALUE.toString(), den: '1' });
    setIsCustomRatioActive(true);
    setError('');
  }, []);

  const transferredIndices = result ? result.currentSection.selectedIndices : [];

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
    totalSectionsCount,
    activeSectionIndex,
    addSection,
    removeLastSection,
    setActiveSection,
  };
}
