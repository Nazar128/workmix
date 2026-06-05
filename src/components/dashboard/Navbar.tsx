"use client";

import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Bell, StickyNote, Menu, X } from "lucide-react"; 
import GlobalSearch from "../GlobalSearch";
import Image from "next/image";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/tasks": "Görevler",
  "/dashboard/projects": "Projeler",
  "/dashboard/organizations": "Organizasyonlar",
  "/dashboard/support": "Destek",
  "/dashboard/roadmap": "İş Çizelgesi",
  "/dashboard/vault": "Kaynaklar",
  "/dashboard/settings": "Ayarlar",
};

interface NavbarProps {
  user: User | null;
  onOpenNotes: () => void;
  isSidebarOpen: boolean;          
  onToggleSidebar: () => void;     
}

export default function Navbar({ user, onOpenNotes, isSidebarOpen, onToggleSidebar }: NavbarProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <div className="  w-full bg-purple-950/20 backdrop-blur-[12px] border-b border-white/10 shadow-2xl z-20">
      <header className="h-16 md:h-20 bg-purple-50/40 flex items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[#996cb2] text-gray-100 transition-colors"
            title={isSidebarOpen ? "Menüyü Kapat" : "Menüyü Aç"}
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <div className="hidden md:block w-56">
            <Image 
              src="/workmıx_logo.png" 
              alt="WorkMix Logo" 
              width={240} 
              height={180} 
              className="w-full h-auto object-contain"
              priority
              loading="eager"
            />
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4 md:mx-0">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-1 sm:gap-3 md:gap-4">
          <button 
            onClick={onOpenNotes}
            className="p-2 rounded-lg hover:bg-[#996cb2] text-gray-100 transition-colors"
            title="Hızlı Not Al"
          >
            <StickyNote size={20} />
          </button>
          
          <button className="p-2 rounded-lg hover:bg-[#996cb2] text-gray-100 transition-colors">
            <Bell size={20} />
          </button>
          
          <button onClick={() => window.location.href = '/dashboard/profile'} className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#b995cd] flex items-center justify-center text-white text-xs md:text-sm font-medium shrink-0">
            {user?.email?.[0].toUpperCase() ?? "?"}
          </button>
        </div>
      </header>
    </div>
  );
}