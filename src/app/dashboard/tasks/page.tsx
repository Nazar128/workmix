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

  let query = supabase
    .from("tasks")
    .select("*, projects(name)")
    .eq("assignee_id", user.id)
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

  const [tasksRes, projectsRes] = await Promise.all([
    query,
    supabase.from("projects").select("id, name").eq("status", "active")
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
      <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] bg-purple-200/20 blur-[100px] rounded-full -z-10" />

      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 italic">
            Görev<span className="text-purple-600">lerim</span>
          </h1>
          <p className="text-slate-500 font-medium">Bugün odaklanman gereken işler burada.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white shadow-xl shadow-purple-500/5">
          <GlobalFilter tableName="tasks" filterConfig={taskFilters} />
          <AddTaskModal projects={projectsRes.data || []} />
        </div>
      </header>

      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Durum</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Görev Detayı</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Proje / Öncelik</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!tasksRes.data || tasksRes.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <CheckCircle2 className="w-12 h-12 opacity-20" />
                    <p className="font-bold tracking-tight text-lg">Tüm görevler tamamlandı!</p>
                  </div>
                </td>
              </tr>
            ) : (
              tasksRes.data.map((task: any) => (
                <tr key={task.id} className="group hover:bg-purple-50/40 transition-all duration-300">
                  <td className="px-8 py-6">
                    <form action={toggleTaskStatus.bind(null, task.id, task.status)}>
                      <button type="submit" className={`transition-transform active:scale-90 ${task.status === 'done' ? 'text-emerald-500' : 'text-slate-300 hover:text-purple-500'}`}>
                        {task.status === 'done' ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                      </button>
                    </form>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <Link href={`/dashboard/tasks/${task.id}`} className={`text-lg font-bold tracking-tight transition-all ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800 hover:text-purple-700'}`}>
                        {task.title}
                      </Link>
                      {task.due_date && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {new Date(task.due_date).toLocaleDateString('tr-TR')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-tight">
                        <Layers className="w-3.5 h-3.5" />
                        {task.projects?.name || "Bireysel"}
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit ${getPriorityColor(task.priority)}`}>
                        <Flag className="w-3 h-3" />
                        {task.priority === 'high' ? 'Acil' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <EditTaskModal task={task} />
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