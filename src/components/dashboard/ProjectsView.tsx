"use client";

import { useState, useEffect } from "react";
import { useNoteDrawer } from "./DashboardShell";
import { deleteProject, toggleProjectStatus } from '@/actions/projects';
import AddProjectModal from '@/components/dashboard/AddProjectModal';
import { EditProjectModal } from '@/components/dashboard/EditProjectModal';
import Link from 'next/link';
import GlobalFilter from "@/components/GlobalFilter";
import { StickyNote, Calendar, Briefcase, User, ExternalLink, Trash2, Rocket, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsView({ initialProjects = [], organizations = [] }: { initialProjects: any[], organizations: any[] }) {
  const { openNotes } = useNoteDrawer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const personalProjects = initialProjects.filter(p => !p.org_id);
  const corporateProjects = initialProjects.filter(p => p.org_id);

  const projectFilters: any = [
    { column: "status", label: "Durum", type: "select", options: [{ label: "Aktif", value: "active" }, { label: "Pasif", value: "passive" }] },
    { column: "visibility", label: "Görünürlük", type: "select", options: [{ label: "Açık", value: "public" }, { label: "Özel", value: "private" }] }
  ];

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-10 min-h-screen bg-[#fafaff] text-slate-900 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-200/30 blur-[100px] rounded-full -z-10" />

      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold tracking-widest uppercase">
            <Rocket className="w-3.5 h-3.5" />
            <span>WorkMix Pro</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-violet-800 to-indigo-900">
            Çalışma Alanım
          </h1>
          <p className="text-slate-500 font-medium max-w-md">Kişisel hedefleriniz ve kurumsal projeleriniz için tek bir dijital merkez.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-white/60 backdrop-blur-md p-2 rounded-[2rem] border border-white shadow-xl shadow-purple-500/5">
          <GlobalFilter tableName="projects" filterConfig={projectFilters} />
          <AddProjectModal organizations={organizations} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-20">
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-gradient-to-b from-purple-600 to-violet-400 rounded-full" />
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-3">
              Bireysel Projeler
              <span className="text-sm font-medium text-slate-400">({personalProjects.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {personalProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-white/80 backdrop-blur-sm border border-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-100 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-4 rounded-2xl shadow-lg shadow-purple-200 group-hover:rotate-6 transition-transform">
                      <StickyNote className="w-6 h-6 text-white" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <EditProjectModal project={project} />
                    </div>
                  </div>

                  <Link href={`/dashboard/projects/${project.id}`}>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-purple-700 transition-colors">
                      {project.name}
                    </h3>
                  </Link>

                  <p className="text-slate-500 text-sm leading-relaxed mb-8 h-10 line-clamp-2">
                    {project.description || "Henüz bir açıklama metni eklenmemiş."}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] tracking-tighter uppercase">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      {new Date(project.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                    </div>
                    <button 
                      onClick={() => openNotes(project.id, project.name)}
                      className="bg-purple-50 text-purple-700 text-xs font-black px-6 py-3 rounded-2xl hover:bg-purple-700 hover:text-white transition-all active:scale-95"
                    >
                      NOTLARI AÇ
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <section className="space-y-10 pb-24">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-gradient-to-b from-indigo-600 to-blue-400 rounded-full" />
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-3">
              Kurumsal Alan
            </h2>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Project</th>
                  <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {corporateProjects.map((project) => (
                  <tr key={project.id} className="group hover:bg-purple-50/30 transition-colors">
                    <td className="px-10 py-8">
                      <form action={toggleProjectStatus.bind(null, project.id, project.status)}>
                        <button type="submit" className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                          project.status === "active" 
                          ? "bg-purple-100 text-purple-700 ring-1 ring-purple-200 shadow-sm shadow-purple-100" 
                          : "bg-slate-100 text-slate-400 ring-1 ring-slate-200"
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${project.status === "active" ? "bg-purple-600 animate-pulse" : "bg-slate-400"}`} />
                          {project.status === "active" ? "ACTIVE" : "PASSIVE"}
                        </button>
                      </form>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <Link href={`/dashboard/projects/${project.id}`} className="text-lg font-bold text-slate-800 hover:text-purple-700 transition-colors">
                          {project.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Layout className="w-3 h-3 text-indigo-400" />
                          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-tighter">
                            {project.organizations?.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex justify-end items-center gap-4">
                        <button onClick={() => openNotes(project.id, project.name)} className="p-3 bg-white border border-slate-100 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                          <StickyNote className="w-4 h-4" />
                        </button>
                        <EditProjectModal project={project} />
                        <form action={deleteProject.bind(null, project.id)}>
                          <button type="submit" className="p-3 bg-white border border-slate-100 text-red-400 hover:bg-red-50 rounded-xl transition-all shadow-sm">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}