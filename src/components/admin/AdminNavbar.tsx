"use client";

import { Bell, Building2, LayoutDashboard, LogOut, Mail, Shield, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link"; 

const navItems = [
  { href: "/admin", label: "Kontrol Paneli", icon: LayoutDashboard, exact: true },
  { href: "/admin/organizations", label: "Organizasyonlar", icon: Building2 },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
  { href: "/admin/announcements", label: "Duyurular", icon: Bell },
  { href: "/admin/support", label: "Destek Talepleri", icon: Mail }
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-950 border-r-2 border-purple-900 flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-white font-bold text-xl tracking-tight">Workmix</p>
            <p className="text-purple-500 text-xs font-semibold uppercase tracking-wider">Site Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? "bg-purple-600/20 text-purple-400 border border-purple-900/50"
                  : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-purple-900/50">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Panelden Çık</span>
        </Link>
      </div>
    </aside>
  );
}