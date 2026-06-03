"use client";

import { useState } from "react";
import { Bell, Building2, LayoutDashboard, LogOut, Mail, Settings2, Shield, Users, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Kontrol Paneli", icon: LayoutDashboard, exact: true },
  { href: "/admin/organizations", label: "Organizasyonlar", icon: Building2 },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
  { href: "/admin/announcements", label: "Duyurular", icon: Bell },
  { href: "/admin/support", label: "Destek Talepleri", icon: Mail },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings2 }
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between lg:block">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-white font-bold text-2xl tracking-tight">Workmix</p>
            <p className="text-purple-500 text-md font-semibold uppercase tracking-wider">Site Admin</p>
          </div>
        </div>
        <button 
          onClick={toggleMenu} 
          className="lg:hidden text-white hover:text-purple-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? "bg-purple-600 text-purple-400 border border-purple-900"
                  : "text-gray-200 hover:bg-purple-800/20 hover:text-gray-100"
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
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Panelden Çık</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-700 via-pink-200 to-blue-400 border-b border-purple-900 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          <span className="text-white font-bold text-lg tracking-tight">Workmix</span>
        </div>
        <button 
          onClick={toggleMenu} 
          className="p-2 text-white bg-purple-900/30 rounded-lg hover:bg-purple-900/50 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 h-screen w-64 
        bg-gradient-to-tl from-purple-700 via-pink-200 to-blue-400 
        border-r-2 border-purple-900 flex flex-col z-50 transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <SidebarContent />
      </aside>
    </>
  );
}