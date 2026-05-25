"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, CheckSquare, FolderOpen, LayoutDashboard, Road, Settings, Vault, HelpCircle, Shield, FileText } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-purple-950/20 backdrop-blur-[12px] border-t-2 border-white/10 shadow-2xl mt-auto">
      <div className="bg-purple-50/40 px-12 py-10 flex flex-col gap-8">
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 pb-4 border-b border-purple-950/10">
          
          <div className="flex flex-col items-center lg:items-start max-w-sm text-center lg:text-left">
            <Image src="/workmıx_logo.png" alt="WorkMix Logo" width={200} height={150} className="mb-3 object-contain" />
            <p className="text-sm font-medium text-purple-950/70 leading-relaxed">
              İş süreçlerinizi, projelerinizi ve organizasyonlarınızı tek bir noktadan pürüzsüzce yönetmeniz için tasarlanmış yeni nesil çalışma alanı çözümü.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">
            
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-950">Hızlı Menü</span>
              <div className="grid gap-2 text-sm font-semibold">
                <Link href="/dashboard" className="flex items-center gap-2 text-[#bb73d5] hover:text-purple-950 transition-colors">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link href="/dashboard/tasks" className="flex items-center gap-2 text-[#bb73d5] hover:text-purple-950 transition-colors">
                  <CheckSquare size={14} /> Görevler
                </Link>
                <Link href="/dashboard/projects" className="flex items-center gap-2 text-[#bb73d5] hover:text-purple-950 transition-colors">
                  <FolderOpen size={14} /> Projeler
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-950">Yönetim</span>
              <div className="grid gap-2 text-sm font-semibold">
                <Link href="/dashboard/organizations" className="flex items-center gap-2 text-[#bb73d5] hover:text-purple-950 transition-colors">
                  <Building2 size={14} /> Organizasyonlar
                </Link>
                <Link href="/dashboard/roadmap" className="flex items-center gap-2 text-[#bb73d5] hover:text-purple-950 transition-colors">
                  <Road size={14} /> İş Çizelgesi
                </Link>
                <Link href="/dashboard/vault" className="flex items-center gap-2 text-[#bb73d5] hover:text-purple-950 transition-colors">
                  <Vault size={14} /> Kaynaklar
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-950">Kurumsal</span>
              <div className="grid gap-2 text-sm font-semibold">
                <Link href="/dashboard/support" className="flex items-center gap-2 text-[#bb73d5] hover:text-purple-950 transition-colors">
                  <HelpCircle size={14} /> Destek Merkezi
                </Link>
                <Link href="/privacy" className="flex items-center gap-2 text-[#bb73d5] hover:text-purple-950 transition-colors">
                  <Shield size={14} /> Gizlilik
                </Link>
                <Link href="/terms" className="flex items-center gap-2 text-[#bb73d5] hover:text-purple-950 transition-colors">
                  <FileText size={14} /> Şartlar
                </Link>
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-medium text-purple-950/60 text-center sm:text-left">
            &copy; {currentYear} <span className="font-bold text-purple-950">WorkMix</span> Inc. Tüm hakları saklıdır.
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-950/50">
            <span>Uygulama Sürümü v2.1.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}