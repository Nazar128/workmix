import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddTaskModal from "@/components/dashboard/AddTaskModal";
import EditTaskModal from "@/components/dashboard/EditTaskModel";
import { deleteTask, toggleTaskStatus } from "@/actions/tasks";
import Link from "next/link";
import GlobalFilter from "@/components/GlobalFilter";
import { CheckCircle2, Circle, Clock, Trash2, Layers, Flag } from "lucide-react";

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

  const { data: userProfile } = await supabase
    .from("profiles")
    .select("organization_id, role")
    .eq("id", user.id)
    .single();

  let query = supabase
    .from("tasks")
    .select("*, projects(name), profiles!tasks_assignee_id_fkey(full_name)")
    .eq("organization_id", userProfile?.organization_id)
    .order('created_at', { ascending: false });

  if (resolvedSearchParams.q && typeof resolvedSearchParams.q === "string") {
    query = query.ilike("title", `%${resolvedSearchParams.q}%`);
  }
  if (resolvedSearchParams.status && typeof resolvedSearchParams.status === "string") {
    query = query.eq("status", resolvedSearchParams.status);
  }
  if (resolvedSearchParams.priority && typeof resolvedSearchParams.priority === "string") {
    query = query.eq("priority", resolvedSearchParams.priority);
  }

  const [tasksRes, projectsRes, membersRes] = await Promise.all([
    query,
    supabase.from("projects").select("id, name").eq("organization_id", userProfile?.organization_id),
    supabase.from("profiles").select("id, full_name, role").eq("organization_id", userProfile?.organization_id)
  ]);

  const taskFilters: any = [
    { column: "status", label: "Durum", type: "select", options: [{ label: "Yapılacak", value: "todo" }, { label: "Bitti", value: "done" }] },
    { column: "priority", label: "Öncelik", type: "select", options: [{ label: "Düşük", value: "low" }, { label: "Orta", value: "medium" }, { label: "Yüksek", value: "high" }] }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="p-4 md:p-10 min-h-screen bg-[#fafaff] relative overflow-hidden">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            <span className="text-purple-600">ORGANİZASYON</span> GÖREVLERİ
          </h1>
          <p className="text-slate-500 text-sm md:font-medium">Şirket genelinde atanan ve takip edilen tüm işler.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm max-w-full overflow-visible">
          <GlobalFilter tableName="tasks" filterConfig={taskFilters} />
          <AddTaskModal projects={projectsRes.data || []} members={membersRes.data || []} />
        </div>
      </header>

      <div className="max-w-6xl mx-auto bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-4 md:px-8 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Durum</th>
              <th className="p-4 md:px-8 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Görev Detayı</th>
              <th className="p-4 md:px-8 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sorumlu / Proje</th>
              <th className="p-4 md:px-8 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!tasksRes.data || tasksRes.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 md:px-8 md:py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <CheckCircle2 className="w-12 h-12 opacity-20" />
                    <p className="font-bold tracking-tight text-lg">Organizasyonda aktif görev bulunmuyor.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tasksRes.data.map((task: any) => (
                <tr key={task.id} className="group hover:bg-purple-50/40 transition-all duration-300">
                  <td className="p-4 md:px-8 md:py-6">
                    <form action={toggleTaskStatus.bind(null, task.id, task.status)}>
                      <button type="submit" className={`transition-transform active:scale-90 ${task.status === 'done' ? 'text-emerald-500' : 'text-slate-300 hover:text-purple-500'}`}>
                        {task.status === 'done' ? <CheckCircle2 className="h-5 w-5 md:w-7 md:h-7" /> : <Circle className="w-5 h-5 md:w-7 md:h-7" />}
                      </button>
                    </form>
                  </td>
                  <td className="p-4 md:px-8 md:py-6">
                    <div className="flex flex-col gap-1">
                      <Link href={`/dashboard/tasks/${task.id}`} className={`text-sm md:text-lg font-bold tracking-tight transition-all ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800 hover:text-purple-700'}`}>
                        {task.title}
                      </Link>
                      {task.due_date && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-tighter">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {new Date(task.due_date).toLocaleDateString('tr-TR')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 md:px-8 md:py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] md:text-[12px] font-bold text-slate-700 tracking-tight">
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md text-[10px]">@{task.profiles?.full_name || "Atanmamış"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-tight">
                        <Layers className="w-3.5 h-3.5" />
                        {task.projects?.name || "Genel"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 md:px-8 md:py-6">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <EditTaskModal task={task} members={membersRes.data || []} />
                      <form action={deleteTask.bind(null, task.id)}>
                        <button type="submit" className="p-2.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-5 h-5" />
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
    </div>
  );
}