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
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-100/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-slate-200/35 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl relative z-10 w-full min-w-0">
        {/* شريط التنقل العلوي النقي مع فواصل نظيفة */}
        <header className="flex justify-between items-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-1 duration-200 w-full min-w-0 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center flex-shrink-0 text-white shadow-xs">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                القوة العربية
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-bold tracking-wide truncate mt-0.5">
                نظام الحساب الرياضي الدقيق عبر 3 دورات متتابعة
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-slate-700 hover:text-red-700 hover:bg-red-50 hover:border-red-200 border-slate-300 transition-colors rounded-xl px-3.5 py-1.5 text-xs h-9 flex-shrink-0 bg-white font-bold cursor-pointer shadow-2xs"
          >
            تسجيل الخروج
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
          </Button>
        </header>

        {/* الحاوية الأساسية مع مسافات مريحة وتجنب التداخل */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full min-w-0 items-start">
          {/* العمود الأيمن: لوحة الإدخال والتحليل */}
          <section className="lg:col-span-4 min-w-0 w-full space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
            <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden w-full min-w-0 rounded-2xl">
              <CardHeader className="py-3 px-4 sm:px-5 border-b border-slate-200 bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-700" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    لوحة الإدخال والتحليل الرقمي
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4 w-full min-w-0">
                <ArabicInput value={text} onChange={val => setText(val)} />

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-xs font-bold text-center leading-relaxed">{error}</p>
                  </div>
                )}

                <Button
                  onClick={() => calculate()}
                  className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!text.trim() || isCalculating}
                >
                  {isCalculating ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span className="font-bold text-white">جاري الحساب الكسري عبر 3 دورات...</span>
                    </div>
                  ) : (
                    <span>بدء الحساب الرقمي (3 دورات)</span>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3 text-center w-full min-w-0">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs min-w-0">
                <div className="text-lg font-black text-blue-700 font-mono" dir="ltr">100%</div>
                <div className="text-xs text-slate-600 font-bold uppercase truncate mt-0.5">
                  دقة كسرية تامة
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs min-w-0">
                <div className="text-lg font-black text-emerald-600 font-bold">لحظي</div>
                <div className="text-xs text-slate-600 font-bold uppercase truncate mt-0.5">
                  أداء فائق بدون تأخير
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-950 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed text-xs font-medium">
                يعمل المحرك آلياً بحساب <strong>دورتين مخفيتين</strong> في الخلفية (أساس 260 ثم البذور المستخرجة)، ثم يعرض نتائج <strong>الدورة الثالثة الظاهرة</strong> في جدول تفاعلي منظم مع أزرار انتقال لكل حرف.
              </p>
            </div>
          </section>

          {/* العمود الأيسر: قسم النتائج */}
          <section className="lg:col-span-8 min-w-0 w-full animate-in fade-in slide-in-from-left-2 duration-200">
            {result ? (
              <ResultView
                result={result}
                onToggleTransfer={toggleSlot}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onInvertSelection={invertSelection}
              />
            ) : (
              <div className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3.5 group p-8 bg-white/70 w-full min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 text-blue-700">
                  <Calculator className="w-7 h-7" />
                </div>
                <div className="text-center space-y-1.5 max-w-sm">
                  <p className="text-slate-900 text-base font-bold">بانتظار إدخال النص العربي</p>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    اكتب أو الصق أي كلمة أو جملة عربية في لوحة الإدخال لبدء الحساب المتتابع عبر 3 دورات واستعراض جدول الحروف وأزرار الانتقال التفاعلية.
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* تذييل الصفحة الاحترافي المطور مع مساحة سفلية وافرة */}
        <footer className="mt-14 pt-6 pb-20 sm:pb-24 border-t border-slate-200 w-full min-w-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-center sm:text-right">
              <span>مشروع القوة العربية</span>
              <span>•</span>
              <span>نظام الحساب الرقمي الدقيق عبر 3 دورات متتابعة</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-2xs text-slate-800 font-bold">
              <span className="text-slate-500 font-medium">تصميم وتطوير:</span>
              <span className="text-blue-800 font-black">محمود علي</span>
            </div>
          </div>
          <div className="text-center text-xs text-slate-400 mt-4 font-medium" dir="rtl">
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
