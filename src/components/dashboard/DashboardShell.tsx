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

  const openNotes = (projectId: string = "", projectName: string = "Genel Notlar") => {
    setActiveProject({ id: projectId, name: projectName });
    setIsOpen(true);
  };

  return (
    <NoteDrawerContext.Provider value={{ openNotes }}>
      <ThemeHandler themePreference={user?.theme_preference} />
      <div className="flex bg-purple-50/20 dark:bg-black text-foreground backdrop-blur-[4px] overflow-hidden min-h-screen transition-colors duration-300">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar 
            user={user} 
            onOpenNotes={() => openNotes()} 
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          
          <div className="flex flex-col md:flex-row flex-1 dark:bg-black">
            <Sidebar isOpen={isSidebarOpen} />
            
            <main className="flex-1 overflow-y-auto p-6 bg-transparent dark:bg-black">
              {children}
            </main>
            
            
            <NoteDrawer
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              projectId={activeProject.id}
              projectName={activeProject.name}
            />

            <SideBar2 />
          </div>
          <Footer />
        </div>
      </div>
    </NoteDrawerContext.Provider>
  );
}

export  function ThemeHandler({ themePreference }: { themePreference?: 'dark' | 'light' | string }) {
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