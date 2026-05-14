"use client";
import { signIn } from '@/actions/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useTransition } from 'react';
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafaff] relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/50 rounded-full blur-[120px]" />

            <div className="w-full max-w-[440px] relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-block p-4 rounded-[2rem] bg-white shadow-sm mb-6">
                        <Image 
                            src="/workmıxlogo.png" 
                            alt="WorkMix Logo" 
                            width={180} 
                            height={40} 
                            className="h-9 w-auto object-contain" 
                        />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tekrar Hoş Geldiniz</h1>
                    <p className="text-slate-500 mt-2 font-medium">WorkMix hesabınıza güvenle giriş yapın</p>
                </div>

                <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(79,70,229,0.08)]">
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                E-Posta Adresi
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="adiniz@sirket.com"
                                className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 transition-all duration-300 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-400">
                                    Şifre
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    Şifremi Unuttum
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 transition-all duration-300 shadow-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 text-white text-sm font-black rounded-2xl shadow-lg shadow-purple-200 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    İşleniyor...
                                </span>
                            ) : (
                                <>
                                    <span>Giriş Yap</span>
                                    <ChevronRightIcon />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <span className="bg-white/0 px-4">veya</span>
                        </div>
                    </div>

                    <p className="text-center text-sm font-medium text-slate-500">
                        Henüz bir hesabınız yok mu?{" "}
                        <Link
                            href="/register"
                            className="text-purple-600 hover:text-purple-700 font-black underline underline-offset-4 transition-colors"
                        >
                            Hemen Kaydolun
                        </Link>
                    </p>
                </div>
                
                <footer className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        © 2026 WorkMix Cloud Platform
                    </p>
                </footer>
            </div>
        </div>
    );
}

function ChevronRightIcon() {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
    );
}