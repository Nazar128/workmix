"use client";

import { useState, createContext, useContext } from "react";
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
      <div className="flex bg-purple-50/20 backdrop-blur-[4px] overflow-hidden min-h-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar 
            user={user} 
            onOpenNotes={() => openNotes()} 
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          
          <div className="flex flex-col md:flex-row flex-1">
            
            <Sidebar isOpen={isSidebarOpen} />
            
            <main className="flex-1 overflow-y-auto p-6">
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