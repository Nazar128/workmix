"use client";

import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Bell, StickyNote } from "lucide-react";
import GlobalSearch from "../GlobalSearch";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/tasks": "Tasks",
  "/dashboard/projects": "Projects",
  "/dashboard/organizations": "Organizations",
  "/dashboard/support": "Support",
  "/dashboard/settings": "Settings",
};

interface NavbarProps {
  user: User | null;
  onOpenNotes: () => void;
}

export default function Navbar({ user, onOpenNotes }: NavbarProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        <GlobalSearch />
        
        <button 
          onClick={onOpenNotes}
          className="p-2 rounded-lg hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors"
          title="Hızlı Not Al"
        >
          <StickyNote size={20} />
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
            {user?.email?.[0].toUpperCase() ?? "?"}
          </div>
          <span className="text-sm text-gray-700 hidden sm:inline">
            {user?.email ?? ""}
          </span>
        </div>
      </div>
    </header>
  );
}