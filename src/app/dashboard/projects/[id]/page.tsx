import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import KanbanBoard from "@/components/KanbanBoard";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: project }, { data: tasks }, { data: members }] = await Promise.all([
    supabase.from("projects").select("*, organizations(name)").eq("id", id).single(),
    supabase.from("tasks").select("id, title, status, priority, due_date, users(name)").eq("project_id", id),
    supabase.from("project_members").select("project_role, users(name, email)").eq("project_id", id),
  ]);

  if (!project) redirect("/dashboard/projects");

  const done = tasks?.filter((t) => t.status === "done").length ?? 0;

  return (
    <div className="p-6">
      <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:underline">← Projeler</Link>

      <h1 className="text-2xl font-bold text-purple-700 mt-4 mb-4">{project.name}</h1>
      <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
        {[
          { label: "Açıklama", value: project.description || "-" },
          { label: "Organizasyon", value: project.organizations?.name || "-" },
          { label: "Durum", value: project.status },
          { label: "İlerleme", value: `${done}/${tasks?.length ?? 0} görev tamamlandı` },
          { label: "Oluşturulma", value: new Date(project.created_at).toLocaleDateString("tr-TR") },
        ].map(({ label, value }) => (
          <div key={label} className="flex border-b border-gray-200 last:border-0">
            <span className="w-36 shrink-0 p-3 bg-gray-50 text-sm font-medium text-gray-600">{label}</span>
            <span className="p-3 text-sm text-gray-800">{value}</span>
          </div>
        ))}
      </div>

      <h2 className="font-semibold text-gray-700 mb-3">Ekip Üyeleri</h2>
      <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-3 font-bold text-gray-700">İsim</th>
              <th className="p-3 font-bold text-gray-700">E-posta</th>
              <th className="p-3 font-bold text-gray-700">Rol</th>
            </tr>
          </thead>
          <tbody>
            {!members?.length ? (
              <tr><td colSpan={3} className="p-4 text-center text-gray-500">Üye bulunamadı.</td></tr>
            ) : members.map((m, i) => (
              <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-sm">{m.users?.[0]?.name || "-"}</td>
                <td className="p-3 text-sm text-gray-600">{m.users?.[0]?.email || "-"}</td>
                <td className="p-3 text-sm text-gray-600">{m.project_role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-semibold text-gray-700 mb-3">Görevler</h2>
      <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-3 font-bold text-gray-700">Görev</th>
              <th className="p-3 font-bold text-gray-700">Atanan</th>
              <th className="p-3 font-bold text-gray-700">Öncelik</th>
              <th className="p-3 font-bold text-gray-700">Durum</th>
            </tr>
          </thead>
          <tbody>
            {!tasks?.length ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">Görev bulunamadı.</td></tr>
            ) : tasks.map((task) => (
              <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3">
                  <Link href={`/tasks/${task.id}`} className="text-purple-700 hover:underline">{task.title}</Link>
                </td>
                <td className="p-3 text-sm text-gray-600">{task.users?.[0]?.name || "-"}</td>
                <td className="p-3 text-sm text-gray-600">{task.priority || "-"}</td>
                <td className="p-3 text-sm">
                  <span className={task.status === "done" ? "text-green-600" : task.status === "in_progress" ? "text-blue-600" : "text-gray-400"}>
                    {task.status === "done" ? "Tamamlandı" : task.status === "in_progress" ? "Devam ediyor" : "Bekliyor"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="font-semibold text-gray-700 mb-3">Kanban Board</h2>
      <KanbanBoard initialTasks={tasks ?? []} projectId={id} />
    </div>
  );
}