'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { validateArabicInput } from '@/lib/rules';
import { AlertCircle, Keyboard } from 'lucide-react';

interface ArabicInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ArabicInput({ value, onChange }: ArabicInputProps) {
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Validate on every change
    if (newValue && !validateArabicInput(newValue)) {
      setError('يرجى إدخال أحرف عربية حصراً لنظام الحساب الرقمي');
      return;
    }

    setError('');
    onChange(newValue);
  };

  return (
    <div className="space-y-2.5 font-cairo">
      <div className="flex justify-between items-center px-1">
        <label
          htmlFor="arabic-text"
          className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
        >
          <Keyboard className="w-4 h-4 text-blue-700" />
          النص العربي المستهدف
        </label>
        <span className="text-[11px] font-bold text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full bg-blue-50">
          إدخال عربي
        </span>
      </div>

      <div className="relative group">
        <Textarea
          id="arabic-text"
          value={value}
          onChange={handleChange}
          placeholder="اكتب أو الصق النص العربي هنا (مثال: مدد، جليل)..."
          className="relative min-h-[110px] text-lg sm:text-xl font-bold bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder:text-slate-400 rounded-xl p-3.5 transition-all duration-200 resize-none leading-relaxed shadow-sm"
          dir="rtl"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-xs font-bold">{error}</p>
        </div>
      )}
    </div>
  );
}
