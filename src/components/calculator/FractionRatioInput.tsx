'use client';

import React, { useRef } from 'react';
import { Check } from 'lucide-react';

export interface FractionRatioInputProps {
  numerator: string;
  denominator: string;
  isActive: boolean;
  onNumeratorChange: (num: string) => void;
  onDenominatorChange: (den: string) => void;
  onToggleActive?: () => void;
  onApply?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

/**
 * FractionRatioInput Component
 * تصميم المربع الكسري المخصص للنسبة (Ratio) مع علامة الصح الخضراء
 * - المربع الأخضر: زر التأشير / التفعيل (Checkmark)
 * - المربع الأزرق: مربع إدخال الكسر الرياضي (بسط ومقام وخط كسر)
 */
export default function FractionRatioInput({
  numerator,
  denominator,
  isActive,
  onNumeratorChange,
  onDenominatorChange,
  onToggleActive,
  onApply,
  size = 'md',
  showLabels = false,
  className = '',
}: FractionRatioInputProps) {
  const numInputRef = useRef<HTMLInputElement>(null);
  const denInputRef = useRef<HTMLInputElement>(null);

  // Filter numeric inputs only (digits 0-9)
  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    onNumeratorChange(val);
  };

  const handleDenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    onDenominatorChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isNum: boolean) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onApply?.();
    } else if (e.key === 'ArrowDown' && isNum) {
      e.preventDefault();
      denInputRef.current?.focus();
      denInputRef.current?.select();
    } else if (e.key === 'ArrowUp' && !isNum) {
      e.preventDefault();
      numInputRef.current?.focus();
      numInputRef.current?.select();
    }
  };

  // Dimensions based on size prop
  const sizeStyles = {
    sm: {
      checkBox: 'w-11 h-14',
      checkIcon: 'w-6 h-6',
      fractionBox: 'w-20 h-14',
      input: 'text-sm font-black h-6',
      line: 'h-[2px] my-0.5',
    },
    md: {
      checkBox: 'w-12 h-16',
      checkIcon: 'w-7 h-7',
      fractionBox: 'w-24 h-16',
      input: 'text-base font-black h-7',
      line: 'h-[2px] my-0.5',
    },
    lg: {
      checkBox: 'w-14 h-20',
      checkIcon: 'w-8 h-8',
      fractionBox: 'w-28 h-20',
      input: 'text-lg font-black h-9',
      line: 'h-[2.5px] my-1',
    },
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${className}`}
      dir="ltr"
      style={{ direction: 'ltr' }}
    >
      {/* 1. المربع الأخضر: زر التأشير / التفعيل والمطابقة مع الرسم */}
      <button
        type="button"
        onClick={() => {
          onToggleActive?.();
          onApply?.();
        }}
        title={isActive ? 'النسبة مفعلة (انقر للإلغاء أو التحديث)' : 'انقر لتفعيل النسبة المخصصة'}
        className={`flex items-center justify-center rounded-xl border-2 transition-all duration-200 cursor-pointer ${sizeStyles.checkBox} ${
          isActive
            ? 'border-emerald-500 bg-emerald-50/90 text-emerald-600 shadow-xs hover:border-emerald-600 hover:bg-emerald-100/80 active:scale-95'
            : 'border-slate-300 bg-slate-50 text-slate-300 hover:border-slate-400 hover:text-slate-400'
        }`}
      >
        <Check
          className={`${sizeStyles.checkIcon} stroke-[3.5] transition-transform duration-150 ${
            isActive ? 'scale-100' : 'scale-75 opacity-40'
          }`}
        />
      </button>

      {/* 2. المربع الأزرق: البوكس الكسري الرياضي (بسط ومقام) */}
      <div
        className={`flex flex-col justify-between items-center rounded-xl border-2 bg-white px-1.5 py-1 transition-all duration-200 shadow-xs ${sizeStyles.fractionBox} ${
          isActive
            ? 'border-blue-500 hover:border-blue-600 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'
            : 'border-slate-300 opacity-60 focus-within:opacity-100 focus-within:border-blue-400'
        }`}
      >
        {/* البسط (Numerator) */}
        <div className="w-full relative flex items-center justify-center">
          <input
            ref={numInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={numerator}
            onChange={handleNumChange}
            onKeyDown={e => handleKeyDown(e, true)}
            onBlur={() => onApply?.()}
            placeholder="5329"
            aria-label="البسط"
            title="البسط (Numerator)"
            className={`w-full text-center bg-transparent border-0 outline-none p-0 text-slate-900 font-mono tracking-tight placeholder:text-slate-300 ${sizeStyles.input}`}
          />
          {showLabels && (
            <span className="absolute -top-3.5 right-0 text-[9px] font-bold text-slate-400">
              بسط
            </span>
          )}
        </div>

        {/* خط الكسر الأفقي (Fraction Line) */}
        <div className={`w-[86%] ${sizeStyles.line} ${isActive ? 'bg-blue-500' : 'bg-slate-300'} rounded-full`} />

        {/* المقام (Denominator) */}
        <div className="w-full relative flex items-center justify-center">
          <input
            ref={denInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={denominator}
            onChange={handleDenChange}
            onKeyDown={e => handleKeyDown(e, false)}
            onBlur={() => {
              if (!denominator || denominator === '0') {
                onDenominatorChange('1');
              }
              onApply?.();
            }}
            placeholder="1"
            aria-label="المقام"
            title="المقام (Denominator)"
            className={`w-full text-center bg-transparent border-0 outline-none p-0 text-slate-900 font-mono tracking-tight placeholder:text-slate-300 ${sizeStyles.input}`}
          />
          {showLabels && (
            <span className="absolute -bottom-3.5 right-0 text-[9px] font-bold text-slate-400">
              مقام
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
