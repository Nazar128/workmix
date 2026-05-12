"use client";

import { useState, useEffect } from "react";
import { useNoteDrawer } from "./DashboardShell";
import { deleteProject, toggleProjectStatus } from '@/actions/projects';
import AddProjectModal from '@/components/dashboard/AddProjectModal';
import { EditProjectModal } from '@/components/dashboard/EditProjectModal';
import Link from 'next/link';
import GlobalFilter from "@/components/GlobalFilter";
import { StickyNote, Calendar, Briefcase, User } from "lucide-react";

export default function ProjectsView({ initialProjects, organizations }: { initialProjects: any[], organizations: any[] }) {
  const { openNotes } = useNoteDrawer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const personalProjects = initialProjects.filter(p => !p.org_id);
  const corporateProjects = initialProjects.filter(p => p.org_id);

  const projectFilters: any = [
    {
      column: "status",
      label: "Durum",
      type: "select",
      options: [
        { label: "Aktif", value: "active" },
        { label: "Pasif", value: "passive" },
        { label: "Arşivlendi", value: "archived" }
      ]
    },
    {
      column: "visibility",
      label: "Görünürlük",
      type: "select",
      options: [
        { label: "Kamuya Açık", value: "public" },
        { label: "Özel", value: "private" }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight">Çalışma Alanım</h1>
          <p className="text-gray-500 text-sm mt-1">Kişisel ve kurumsal projelerini tek bir merkezden yönet.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <GlobalFilter tableName="projects" filterConfig={projectFilters} />
          <AddProjectModal organizations={organizations} />
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Bireysel Çalışma Alanı</h2>
          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
            {personalProjects.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalProjects.length === 0 ? (
            <div className="col-span-full py-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
              <p>Henüz bireysel bir proje oluşturulmadı.</p>
            </div>
          ) : (
            personalProjects.map((project) => (
              <div key={project.id} className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <StickyNote className="w-5 h-5" />
                  </div>
                  <div className="flex gap-2">
                    <EditProjectModal project={project} />
                  </div>
                </div>
                <Link href={`/dashboard/projects/${project.id}`} className="block group-hover:text-blue-600 transition-colors">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{project.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">
                  {project.description || "Açıklama eklenmemiş."}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {mounted && project.created_at ? new Date(project.created_at).toLocaleDateString() : "..."}
                  </div>
                  <button 
                    onClick={() => openNotes(project.id, project.name)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
                  >
                    Notları Aç
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <Briefcase className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">Kurumsal Projeler</h2>
          <span className="bg-purple-50 text-purple-600 text-xs font-semibold px-2 py-1 rounded-full">
            {corporateProjects.length}
          </span>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-700 text-sm">Durum</th>
                <th className="p-4 font-bold text-gray-700 text-sm">Proje Adı</th>
                <th className="p-4 font-bold text-gray-700 text-sm">Organizasyon</th>
                <th className="p-4 font-bold text-sm text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {corporateProjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500">
                    Kurumsal bir projede yer almıyorsunuz.
                  </td>
                </tr>
              ) : (
                corporateProjects.map((project: any) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <form action={toggleProjectStatus.bind(null, project.id, project.status)}>
                        <button
                          type="submit"
                          className={`text-xl ${project.status === "active" ? "text-green-600" : "text-gray-300 hover:text-purple-600"}`}
                        >
                          {project.status === "active" ? "●" : "○"}
                        </button>
                      </form>
                    </td>
                    <td className="p-4">
                      <Link href={`/dashboard/projects/${project.id}`} className="text-purple-600 hover:underline font-semibold">
                        {project.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {project.organizations?.name || "Bilinmiyor"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end items-center gap-3">
                        <button 
                          onClick={() => openNotes(project.id, project.name)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-bold bg-blue-50 px-3 py-1 rounded-lg"
                        >
                          Notlar
                        </button>
                        <EditProjectModal project={project} />
                        <form action={deleteProject.bind(null, project.id)}>
                          <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium">
                            Sil
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}