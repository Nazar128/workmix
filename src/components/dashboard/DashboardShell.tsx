"use client";

import { useState, createContext, useContext, useEffect } from "react";
import Navbar from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import NoteDrawer from "@/components/dashboard/NoteDrawer";
import SideBar2 from "./SideBar2";
import Footer from "./Footer";

const NoteDrawerContext = createContext<{
  openNotes: (projectId?: string, projectName?: string) => void;
} | null>(null);

export const useNoteDrawer = () => {
  const context = useContext(NoteDrawerContext);
  if (!context) throw new Error("useNoteDrawer must be used within a DashboardShell");
  return context;
};

export default function DashboardShell({
  children,
  user
}: {
  children: React.ReactNode;
  user: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProject, setActiveProject] = useState({ id: "", name: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openNotes = (projectId: string = "", projectName: string = "Genel Notlar") => {
    setActiveProject({ id: projectId, name: projectName });
    setIsOpen(!isOpen);
  };

  return (
    <NoteDrawerContext.Provider value={{ openNotes }}>
      <ThemeHandler themePreference={user?.theme_preference} />
      
      <div className="flex flex-col min-h-screen bg-purple-50/20 dark:bg-black text-foreground backdrop-blur-[4px] transition-colors duration-300">
        
        <div className="w-full shrink-0 z-50">
          <Navbar 
            user={user} 
            onOpenNotes={() => openNotes()} 
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
        
        <div className="flex flex-1 relative dark:bg-black items-stretch h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-hidden">
          <div className={`
            fixed inset-y-16 z-40 md:static md:h-full transition-all duration-300 shrink-0
            ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0 md:w-0 md:hidden"}
          `}>
            <Sidebar isOpen={isSidebarOpen} />
          </div>

          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <main className="  p-4 md:p-6 bg-transparent dark:bg-black w-full global-scroll">
            {children}
          </main>
          
          <div className="  shrink-0 h-full overflow-y-auto sticky top-0 right-0 border-l border-border dark:border-neutral-800 bg-transparent">
            <SideBar2 />
          </div>

          <NoteDrawer
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            projectId={activeProject.id}
            projectName={activeProject.name}
          />
        </div>

        <div className="w-full shrink-0 mt-auto z-50">
          <Footer />
        </div>
      </div>
    </NoteDrawerContext.Provider>
  );
}

export function ThemeHandler({ themePreference }: { themePreference?: 'dark' | 'light' | string }) {
  useEffect(() => {
    const root = window.document.documentElement;
    if (themePreference === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themePreference]);

  return null; 
}