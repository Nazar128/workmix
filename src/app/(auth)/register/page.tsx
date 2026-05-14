"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp } from "@/actions/auth";
import Image from "next/image";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await signUp(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (result.message.includes("doğrulayınız")) {
        toast.success(result.message, { duration: 6000 });
        router.push("/login?registered=true");
        return;
      }

      toast.success("Hoş geldiniz! Hesabınız oluşturuldu.");
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafaff] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-[480px] relative z-10">
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Yeni Hesap Oluştur</h1>
          <p className="text-slate-500 mt-2 font-medium">WorkMix ile projelerinizi yönetmeye başlayın</p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(79,70,229,0.08)]">
          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Nazar Kalçık"
                className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                E-Posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nazar@sirket.com"
                className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 transition-all duration-300 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Tekrar
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 text-white text-sm font-black rounded-2xl shadow-lg shadow-purple-200 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 group mt-4"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Oluşturuluyor...
                </span>
              ) : (
                <>
                  <span>Hesap Oluştur</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 9l-6 6-6-6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed font-medium">
            Kayıt olarak{" "}
            <Link href="/terms" className="text-purple-500 hover:underline">Kullanım Şartları</Link>
            {" "}ve{" "}
            <Link href="/privacy" className="text-purple-500 hover:underline">Gizlilik Politikası</Link>
            'nı kabul etmiş olursunuz.
          </p>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span className="bg-white/0 px-4">veya</span>
            </div>
          </div>

          <p className="text-center text-sm font-medium text-slate-500">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-black underline underline-offset-4 transition-colors"
            >
              Giriş Yapın
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