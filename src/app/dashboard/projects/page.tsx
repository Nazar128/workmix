import { deleteProject, toggleProjectStatus } from '@/actions/projects';
import AddProjectModal from '@/components/dashboard/AddProjectModal';
import { EditProjectModal } from '@/components/dashboard/EditProjectModal';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import GlobalFilter from "@/components/GlobalFilter";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("projects")
    .select("*, organizations!org_id(name)")
    .eq("created_by", user.id);

  if (resolvedSearchParams.q && typeof resolvedSearchParams.q === "string") {
    query = query.ilike("name", `%${resolvedSearchParams.q}%`);
  }
  if (resolvedSearchParams.status && typeof resolvedSearchParams.status === "string") {
    query = query.eq("status", resolvedSearchParams.status);
  }
  if (resolvedSearchParams.visibility && typeof resolvedSearchParams.visibility === "string") {
    query = query.eq("visibility", resolvedSearchParams.visibility);
  }

  const [projectsRes, organizationRes] = await Promise.all([
    query,
    supabase
      .from("organizations")
      .select("id, name")
      .eq("status", "active"),
  ]);

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
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-purple-700">Projelerim</h1>
        <div className="flex flex-wrap items-center gap-2">
          <GlobalFilter tableName="projects" filterConfig={projectFilters} />
          <AddProjectModal organizations={organizationRes.data || []} />
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
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
            {!projectsRes.data || projectsRes.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Proje bulunamadı.
                </td>
              </tr>
            ) : (
              projectsRes.data.map((project: any) => (
                <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <form action={toggleProjectStatus.bind(null, project.id, project.status)}>
                      <button
                        type="submit"
                        className={`text-xl ${project.status === "active" ? "text-green-600" : "text-gray-400 hover:text-purple-600"}`}
                      >
                        {project.status === "active" ? "✓" : "○"}
                      </button>
                    </form>
                  </td>
                  <td className="p-4">
                    <Link 
                      href={`/dashboard/projects/${project.id}`}
                      className="text-purple-600 hover:underline font-medium"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-600">
                    {project.organizations?.name || "-"}
                  </td>
                  <td className="p-4 flex gap-3">
                    <EditProjectModal project={project} />
                    <form action={deleteProject.bind(null, project.id)}>
                      <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Sil
                      </button>
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