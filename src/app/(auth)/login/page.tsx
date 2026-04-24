"use client"
import { signIn } from '@/actions/auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useTransition } from 'react'
import { toast } from 'sonner';

export default function LoginPage() {

    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("registered") === "true") {
            toast.success("Hesabınız oluşturuldu. Giriş yapabilirsiniz.");
        }
    }, [searchParams]);

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await signIn(formData);
            if (!result.success) {
                toast.error(result.message);
            }
        });
    }

    return (

    <div className="min-h-screen bg-[#080b12] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />
 
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h10M4 18h13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            WorkMix
          </h1>
          <p className="text-sm text-slate-400 mt-1">Hesabınıza giriş yapın</p>
        </div>

        <div className="bg-[#0d1117] border border-[#1e2433] rounded-2xl p-8 shadow-2xl">
          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="ornek@gmail.com"
                className="w-full px-4 py-2.5 bg-[#131720] border border-[#1e2433] rounded-lg text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Şifre
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Şifremi unuttum
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#131720] border border-[#1e2433] rounded-lg text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
 
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e2433]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0d1117] px-2 text-slate-600">veya</span>
            </div>
          </div>
 
          <p className="text-center text-sm text-slate-500">
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Ücretsiz kayıt olun
            </Link>
          </p>
        </div>
 
      </div>
    </div>
  );


}