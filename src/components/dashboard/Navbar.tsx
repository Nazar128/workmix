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
    <div className="bg-purple-950/20 backdrop-blur-[12px] border-2  border-white/10 shadow-2xl shadow-purple-200">
      <header className="h-20  bg-purple-50/40  flex items-center justify-between">
      
      <div className="flex items-center gap-4 ml-6">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-[#996cb2] text-gray-100 transition-colors"
          title={isSidebarOpen ? "Menüyü Kapat" : "Menüyü Aç"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        

        <Image src="/workmıx_logo.png" alt="WorkMix Logo" width={240} height={180} className="ml-2" />
      </div>

      <div className="flex items-center gap-4">
        <GlobalSearch />
        <button 
          onClick={onOpenNotes}
          className="p-2 rounded-lg hover:bg-[#996cb2] text-gray-100  transition-colors"
          title="Hızlı Not Al"
        >
          <StickyNote size={20} />
        </button>
        <button className="p-2 rounded-lg hover:bg-[#996cb2] text-gray-100">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-4 mr-6">
          <div className="w-12 h-12 rounded-full bg-[#b995cd] flex items-center justify-center text-white text-sm font-medium">
            {user?.email?.[0].toUpperCase() ?? "?"}
          </div>
        </div>
      </div>
    </header>
    </div>
    
  );
}