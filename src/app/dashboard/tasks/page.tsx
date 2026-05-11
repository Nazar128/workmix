import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddTaskModal from "@/components/dashboard/AddTaskModal";
import EditTaskModal from "@/components/dashboard/EditTaskModel";
import { deleteTask, toggleTaskStatus } from "@/actions/tasks";
import Link from "next/link";
import GlobalFilter from "@/components/GlobalFilter";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const resolvedSearchParams = await searchParams;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() { },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("tasks")
    .select("*, projects(name)")
    .eq("assignee_id", user.id);

  if (resolvedSearchParams.q && typeof resolvedSearchParams.q === "string") {
    query = query.ilike("title", `%${resolvedSearchParams.q}%`);
  }
  if (resolvedSearchParams.status && typeof resolvedSearchParams.status === "string") {
    query = query.eq("status", resolvedSearchParams.status);
  }
  if (resolvedSearchParams.priority && typeof resolvedSearchParams.priority === "string") {
    query = query.eq("priority", resolvedSearchParams.priority);
  }

  const [tasksRes, projectsRes] = await Promise.all([
    query,
    supabase.from("projects").select("id, name").eq("status", "active")
  ]);

  const taskFilters: any = [
    { column: "status", label: "Durum", type: "select", options: [{ label: "Yapılacak", value: "todo" }, { label: "Bitti", value: "done" }] },
    { column: "priority", label: "Öncelik", type: "select", options: [{ label: "Acil", value: "high" }, { label: "Normal", value: "medium" }] }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-purple-700">Görevlerim</h1>
        <div className="flex flex-wrap items-center gap-2">
          <GlobalFilter tableName="tasks" filterConfig={taskFilters} />
          <AddTaskModal projects={projectsRes.data || []} />
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-4 font-bold text-gray-700">Durum</th>
              <th className="p-4 font-bold text-gray-700">Görev</th>
              <th className="p-4 font-bold text-gray-700">Proje</th>
              <th className="p-4 font-bold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {!tasksRes.data || tasksRes.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">Görev bulunamadı.</td>
              </tr>
            ) : (
              tasksRes.data.map((task: any) => (
                <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <form action={toggleTaskStatus.bind(null, task.id, task.status)}>
                      <button type="submit" className={`text-xl ${task.status === 'done' ? 'text-green-600' : 'text-gray-400 hover:text-purple-600'}`}>
                        {task.status === 'done' ? '✓' : '○'}
                      </button>
                    </form>
                  </td>
                  <td className="p-4">
                    <Link href={`/dashboard/tasks/${task.id}`} className="text-purple-600 hover:underline font-medium">
                      {task.title}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-600">{task.projects?.name || "-"}</td>
                  <td className="p-4 flex gap-3">
                    <EditTaskModal task={task} />
                    <form action={deleteTask.bind(null, task.id)}>
                      <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium">Sil</button>
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