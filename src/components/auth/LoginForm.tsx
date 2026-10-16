'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, ShieldCheck, Calculator } from 'lucide-react';

// Hardcoded credentials
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = '1234';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/');
      } else {
        setError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-6 relative overflow-hidden font-cairo">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-100/50 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-[960px] grid grid-cols-1 lg:grid-cols-2 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Left Side: Brand/Hero */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-8 text-white">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              القوة العربية <br />
              <span className="text-blue-400 font-black">الحساب الرقمي الدقيق</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              نظام رياضي فائق الدقة لتفكيك وتحليل النصوص العربية عبر قسمين متتابعين (الأساس 5329) بنظام كسري خالص.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest pt-6 border-t border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>نظام آمن • دقة كسرية 100% بدون تقريب</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-8 bg-white">
          <div className="space-y-2 lg:hidden text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md">
                <Calculator className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900">القوة العربية</h2>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 hidden lg:block">تسجيل الدخول</h2>
            <p className="text-slate-500 text-sm font-medium">أدخل بياناتك للوصول إلى لوحة الحساب الرقمي</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-xs font-bold">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">اسم المستخدم</label>
              <div className="relative group">
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="h-12 bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 pr-10 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="h-12 bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 pr-10 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-bold text-base rounded-xl shadow-md shadow-blue-700/20 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <span>جاري التحقق...</span> : <span>دخول للنظام</span>}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-xs font-bold pt-4 border-t border-slate-100">
            مشروع القوة العربية • محرك الحساب الرقمي عبر قسمين متتابعين (الأساس 5329)
          </p>
        </div>
      </div>
    </div>
  );
}
