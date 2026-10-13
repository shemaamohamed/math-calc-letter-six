'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ArabicInput from '@/components/calculator/ArabicInput';
import ResultView from '@/components/calculator/ResultView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWordCalculator } from '@/hooks/useWordCalculator';
import { useRouter } from 'next/navigation';
import { LogOut, Calculator, Loader2, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen min-h-[100dvh] w-full bg-slate-50 text-slate-900 relative font-cairo selection:bg-blue-500/20 overflow-x-clip" dir="rtl">
      {/* خلفية جمالية خفيفة بدون أي تدرجات داكنة */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-100/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-slate-200/40 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 max-w-7xl relative z-10 w-full min-w-0">
        {/* شريط التنقل العلوي النقي */}
        <header className="flex justify-between items-center mb-5 sm:mb-7 animate-in fade-in slide-in-from-top-2 duration-300 w-full min-w-0 pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center shadow-md shadow-blue-700/20 flex-shrink-0 text-white">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                القوة العربية
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-bold tracking-wide truncate mt-0.5">
                نظام الحساب الرياضي الدقيق عبر 4 دورات متتابعة
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-slate-700 hover:text-red-700 hover:bg-red-50 hover:border-red-200 border-slate-300 transition-all rounded-xl px-3.5 py-1.5 text-xs h-9 flex-shrink-0 bg-white font-bold cursor-pointer"
          >
            تسجيل الخروج
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
          </Button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 w-full min-w-0">
          {/* العمود الأيمن: لوحة الإدخال والتحليل */}
          <section className="lg:col-span-4 min-w-0 w-full space-y-4 animate-in fade-in slide-in-from-right-3 duration-300">
            <Card className="bg-white border-2 border-slate-200 shadow-sm overflow-hidden w-full min-w-0 rounded-2xl">
              <CardHeader className="py-3.5 px-4 border-b border-slate-200 bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-700" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    لوحة الإدخال والتحليل الرقمي
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4 w-full min-w-0">
                <ArabicInput value={text} onChange={val => setText(val)} />

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-xs font-bold text-center leading-relaxed">{error}</p>
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
                      <span className="font-bold text-white">جاري الحساب الكسري عبر 4 دورات...</span>
                    </div>
                  ) : (
                    <span>بدء الحساب الرقمي (4 دورات)</span>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-2.5 text-center w-full min-w-0">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm min-w-0">
                <div className="text-lg font-black text-blue-700 font-mono" dir="ltr">100%</div>
                <div className="text-xs text-slate-600 font-bold uppercase truncate mt-0.5">
                  دقة كسرية تامة
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm min-w-0">
                <div className="text-lg font-black text-emerald-600 font-bold">لحظي</div>
                <div className="text-xs text-slate-600 font-bold uppercase truncate mt-0.5">
                  أداء فائق بدون تأخير
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed text-xs font-medium">
                يعمل المحرك آلياً بحساب <strong>3 دورات مخفية</strong> في الخلفية (أساس 260 ثم البذور المستخرجة)، ثم يعرض نتائج <strong>الدورة الرابعة الظاهرة</strong> مع زر انتقال تفاعلي لكل سطر.
              </p>
            </div>
          </section>

          {/* العمود الأيسر: قسم النتائج */}
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
              <div className="h-full min-h-[360px] rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-3.5 group p-6 bg-white/80 w-full min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-all duration-200 border border-slate-200 text-blue-700">
                  <Calculator className="w-7 h-7" />
                </div>
                <div className="text-center space-y-1.5 max-w-sm">
                  <p className="text-slate-900 text-base font-bold">بانتظار إدخال النص العربي</p>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    اكتب أو الصق أي كلمة أو نص عربي في لوحة الإدخال (مثال: مدد) لبدء الحساب المتتابع عبر 4 دورات وعرض الأسطر الكسرية وزر الانتقال.
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* تذييل الصفحة الاحترافي المطور */}
        <footer className="mt-12 pt-6 pb-8 border-t border-slate-200 w-full min-w-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span>مشروع القوة العربية</span>
              <span>•</span>
              <span>نظام الحساب الرقمي الدقيق عبر 4 دورات متتابعة</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-300 shadow-sm text-slate-800 font-bold">
              <span className="text-slate-500 font-medium">تصميم وتطوير:</span>
              <span className="text-blue-800 font-black">محمود علي</span>
            </div>
          </div>
          <div className="text-center text-xs text-slate-400 mt-3 font-medium">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </div>
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
