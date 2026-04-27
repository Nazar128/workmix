import { deleteProject, toggleProjectStatus } from '@/actions/projects';
import AddProjectModal from '@/components/dashboard/AddProjectModal';
import { EditProjectModal } from '@/components/dashboard/EditProjectModal';
import { createServerClient } from '@supabase/ssr';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function ProjectsPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient( process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: {getAll() { return cookieStore.getAll();}, setAll() {},},}
    );

    const { data: {user}} = await supabase.auth.getUser();
    if (!user) redirect("/login");
 const [projectsRes, organizationRes] = await Promise.all([
    supabase
      .from("projects")
      .select("*, organizations(name)")
      .eq("created_by", user.id),
    supabase
      .from("organizations")
      .select("id, name")
      .eq("status", "active"),
  ]);
   return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-700">Projelerim</h1>
        <AddProjectModal organizations={organizationRes.data || []} />
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-4 font-bold text-gray-700">Durum</th>
              <th className="p-4 font-bold text-gray-700">Proje Adı</th>
              <th className="p-4 font-bold text-gray-700">Organizasyon</th>
              <th className="p-4 font-bold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {projectsRes.data?.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Proje bulunamadı.
                </td>
              </tr>
            ) : (
              projectsRes.data?.map((project) => ( 
                <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4">
                    <form action={toggleProjectStatus.bind(null, project.id, project.status)}>
                      <button
                        type="submit"
                        className={project.status === "active" ? "text-green-600" : "text-gray-400"}
                      >
                        {project.status === "active" ? "✓" : "○"}
                      </button>
                    </form>
                  </td>
                  <td className="p-4">{project.name}</td>
                  <td className="p-4 text-gray-600">
                    {project.organizations?.name || "-"}
                  </td>
                  <td className="p-4 flex gap-2">
                    <EditProjectModal project={project} />
                    <form action={deleteProject.bind(null, project.id)}>
                      <button type="submit" className="text-red-600">Sil</button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


