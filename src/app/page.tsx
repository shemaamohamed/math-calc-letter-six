'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ArabicInput from '@/components/calculator/ArabicInput';
import ResultView from '@/components/calculator/ResultView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWordCalculator } from '@/hooks/useWordCalculator';
import { useRouter } from 'next/navigation';
import { Sparkles, LogOut, Calculator, Loader2, ShieldCheck } from 'lucide-react';

function HomePage() {
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
  } = useWordCalculator('');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-slate-50 text-slate-900 relative font-cairo selection:bg-blue-500/20 overflow-x-clip">
      {/* Subtle background gradient pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-slate-200/40 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 max-w-7xl relative z-10 w-full min-w-0">
        {/* Compact Navigation Bar */}
        <header className="flex justify-between items-center mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-2 duration-300 w-full min-w-0 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center shadow-md shadow-blue-700/20 flex-shrink-0 text-white">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                القوة العربية
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold tracking-wide truncate">
                نظام الحساب الرياضي الدقيق عبر 4 دورات متتابعة (Arbitrary-Precision 4 Iterations)
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-slate-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 border-slate-300 transition-all rounded-xl px-3 py-1.5 text-xs h-9 flex-shrink-0 bg-white"
          >
            تسجيل الخروج
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
          </Button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full min-w-0">
          {/* Left Column: Input */}
          <section className="lg:col-span-4 min-w-0 w-full space-y-4 animate-in fade-in slide-in-from-right-3 duration-300">
            <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden w-full min-w-0">
              <CardHeader className="py-3 px-4 border-b border-slate-200 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-700" />
                  <CardTitle className="text-sm font-bold text-slate-800">
                    لوحة الإدخال والتحليل الرقمي
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 space-y-4 w-full min-w-0">
                <ArabicInput value={text} onChange={val => setText(val)} />

                {error && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-xs font-semibold text-center">{error}</p>
                  </div>
                )}

                <Button
                  onClick={() => calculate()}
                  className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-700/20 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer flex items-center justify-center gap-2"
                  disabled={!text.trim() || isCalculating}
                >
                  {isCalculating ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span className="font-semibold text-white">جاري الحساب الكسري عبر 4 دورات...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>بدء الحساب الرقمي (4 دورات)</span>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-2.5 text-center w-full min-w-0">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm min-w-0">
                <div className="text-lg font-black text-blue-700 font-mono">١٠٠٪</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase truncate">
                  دقة كسرية تامة
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm min-w-0">
                <div className="text-lg font-black text-emerald-600 font-mono">لحظي</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase truncate">
                  أداء فائق بدون تأخير
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed text-[11px]">
                يعمل المحرك آلياً بحساب <strong>3 دورات مخفية</strong> في الخلفية (أساس 260 ➔ البذور)، ثم يعرض نتائج <strong>الدورة الرابعة الظاهرة</strong> مع زر انتقال تفاعلي لكل سطر.
              </p>
            </div>
          </section>

          {/* Right Column: Results */}
          <section className="lg:col-span-8 min-w-0 w-full animate-in fade-in slide-in-from-left-3 duration-300">
            {result ? (
              <ResultView
                result={result}
                onToggleTransfer={toggleSlot}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onInvertSelection={invertSelection}
              />
            ) : (
              <div className="h-full min-h-[340px] rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-3 group p-6 bg-white/70 w-full min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-all duration-200 border border-slate-200 text-blue-700">
                  <Calculator className="w-7 h-7" />
                </div>
                <div className="text-center space-y-1 max-w-xs">
                  <p className="text-slate-800 text-sm font-bold">بانتظار إدخال النص العربي</p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    اكتب أو الصق أي كلمة أو نص عربي في لوحة الإدخال (مثال: مدد) لبدء الحساب المتتابع عبر 4 دورات وعرض الأسطر الكسرية وزر الانتقال.
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-8 pt-4 border-t border-slate-200 text-center text-slate-500 text-xs w-full min-w-0">
          <p>© {new Date().getFullYear()} مشروع القوة العربية • محرك الحساب الرقمي الدقيق 4 دورات متتابعة</p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
