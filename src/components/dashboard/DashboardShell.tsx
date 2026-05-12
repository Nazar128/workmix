"use client";

import { useState, createContext, useContext } from "react";
import Navbar from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import NoteDrawer from "@/components/dashboard/NoteDrawer";

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

  const openNotes = (projectId: string = "", projectName: string = "Genel Notlar") => {
    setActiveProject({ id: projectId, name: projectName });
    setIsOpen(true);
  };

  return (
    <NoteDrawerContext.Provider value={{ openNotes }}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar user={user} onOpenNotes={() => openNotes()} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>

        <NoteDrawer 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          projectId={activeProject.id}
          projectName={activeProject.name}
        />
      </div>
    </NoteDrawerContext.Provider>
  );
}