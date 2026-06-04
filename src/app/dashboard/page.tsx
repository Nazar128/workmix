import { Folder, Users, CheckCircle2, ArrowRight, Plus, Calendar, Clock, AlertCircle, ShieldAlert, CheckSquare, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/dashboard/Statcards";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userProfile } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  const orgId = userProfile?.organization_id;

  const [
    projectsRes,
    membersRes,
    allTasksRes,
    criticalTasksRes
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('tasks').select('id, status').eq('organization_id', orgId),
    supabase.from('tasks')
      .select('*, projects(name)')
      .eq('organization_id', orgId)
      .neq('status', 'done')
      .order('priority', { ascending: false })
      .order('due_date', { ascending: true })
      .limit(3)
  ]);

  const projectCount = projectsRes.count ?? 0;
  const memberCount = membersRes.count ?? 0;
  const tasks = allTasksRes.data || [];

  const completedTasksCount = tasks.filter(t => t.status === 'done').length;
  const totalTasksCount = tasks.length;
  
  const progressPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  const remainingTasksCount = totalTasksCount - completedTasksCount;

  return (
    <div className="min-h-full from-purple-50/40 via-slate-50 to-indigo-50/20 flex flex-col gap-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Genel Bakış</h1>
          <p className="text-sm text-gray-500 mt-0.5">Organizasyonunuzun güncel durumu ve operasyonel verileri.</p>
        </div>
      </div>

      <AnnouncementBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Toplam Proje"
          value={projectCount}
          icon={Folder}
          description="Aktif olarak yürüttüğünüz projeler"
        />
        <StatsCard 
          title="Ekip Üyeleri"
          value={memberCount}
          icon={Users}
          description="Organizasyonunuzdaki toplam kişi sayısı"
        />
        <StatsCard 
          title="Tamamlanan Görevler"
          value={completedTasksCount}
          icon={CheckCircle2}
          description="Organizasyonda bitirilen toplam iş sayısı"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 border border-white/20 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-800">Kritik ve Yaklaşan Görevler</h3>
                <p className="text-xs text-gray-400 mt-0.5">Acil aksiyon alınması gereken yüksek öncelikli ve süresi yaklaşan işler.</p>
              </div>
              {criticalTasksRes.data && criticalTasksRes.data.length > 0 && (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {criticalTasksRes.data.length} Kritik İş
                </span>
              )}
            </div>

            <div className="space-y-3">
              {!criticalTasksRes.data || criticalTasksRes.data.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Şu an acil veya süresi yaklaşan bir görev bulunmuyor.</p>
              ) : (
                criticalTasksRes.data.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-slate-100 hover:shadow-sm transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg ${task.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                        {task.priority === 'high' ? <ShieldAlert size={16} /> : <CheckSquare size={16} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{task.title}</p>
                        <p className="text-xs text-gray-400 truncate">{task.projects?.name || "Genel Proje"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                      {task.due_date && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {new Date(task.due_date).toLocaleDateString('tr-TR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="border border-white/20 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Genel İlerleme Durumu</h3>
            <p className="text-xs text-gray-400 mb-4">Organizasyona ait görevlerin tamamlanma oranı.</p>
            
            <div className="space-y-4">
              <div className="bg-white/80 border border-slate-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-600">Başarı Oranı</span>
                  <span className="text-xs font-bold text-purple-600">%{progressPercentage}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }} 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>{completedTasksCount} Biten</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span>{remainingTasksCount} Kalan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-white/20 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-800">Son Aktiviteler</h3>
                <p className="text-xs text-gray-400 mt-0.5">Ekibinizin gerçekleştirdiği son işlemler.</p>
              </div>
              <Link href="/dashboard/tasks" className="text-xs font-semibold text-purple-600 hover:text-indigo-600 flex items-center gap-0.5 transition cursor-pointer">
                <span>Tümünü Gör</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/40 transition">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-0.5 border border-purple-100">
                  <Folder size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">Yeni bir proje entegrasyonu sağlandı.</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> Bugün</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-white/20 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-800">Sistem ve Altyapı Sağlığı</h3>
                <p className="text-xs text-gray-400 mt-0.5">BaaS ve entegrasyon hatlarının durumu.</p>
              </div>
              <Activity size={16} className="text-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Supabase Veritabanı</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">Aktif</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Realtime Dinamik Kanallar</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">Sorunsuz</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Stripe Ödeme Modülü</span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50">Sandbox Modu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}