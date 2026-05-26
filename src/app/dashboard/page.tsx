import { Folder, Users, CheckCircle2, ArrowRight, Plus, Calendar, Clock, AlertCircle, ShieldAlert, CheckSquare, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/dashboard/Statcards";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: projectCount },
    { count: memberCount }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('org_members').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="min-h-full  from-purple-50/40 via-slate-50 to-indigo-50/20 flex flex-col gap-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between  border-b border-gray-100 ">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Genel Bakış</h1>
          <p className="text-sm text-gray-500 mt-0.5">Organizasyonunuzun güncel durumu ve operasyonel verileri.</p>
        </div>

      </div>

      <AnnouncementBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Toplam Proje"
          value={projectCount ?? 0}
          icon={Folder}
          description="Aktif olarak yürüttüğünüz projeler"
        />
        <StatsCard 
          title="Ekip Üyeleri"
          value={memberCount ?? 0}
          icon={Users}
          description="Organizasyonunuzdaki toplam kişi sayısı"
        />
        <StatsCard 
          title="Tamamlanan"
          value="12"
          icon={CheckCircle2}
          description="Bu ay tamamlanan işler"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 border border-white/20 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-800">Kritik ve Yaklaşan Görevler</h3>
                <p className="text-xs text-gray-400 mt-0.5">Acil aksiyon alınması gereken yüksek öncelikli işler.</p>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 flex items-center gap-1">
                <AlertCircle size={12} />
                2 Kritik İş
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-slate-100 hover:shadow-sm transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <ShieldAlert size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">Stripe entegrasyon testlerini tamamla</p>
                    <p className="text-xs text-gray-400 truncate">WorkMix SaaS • Ödeme Altyapısı</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-red-700 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md whitespace-nowrap">Bugün</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-slate-100 hover:shadow-sm transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <CheckSquare size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">Kanban Board responsive hatalarını düzelt</p>
                    <p className="text-xs text-gray-400 truncate">WorkMix SaaS • UI/UX Geliştirme</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md whitespace-nowrap">Yarın</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-white/20 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Bugünkü İlerleme Durumu</h3>
            <p className="text-xs text-gray-400 mb-4">Atanan günlük görevlerin tamamlanma oranı.</p>
            
            <div className="space-y-4">
              <div className="bg-white/80 border border-slate-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-600">Genel Tamamlanma</span>
                  <span className="text-xs font-bold text-purple-600">%75</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '75%' }} />
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>9 Biten</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span>3 Kalan</span>
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
              <button className="text-xs font-semibold text-purple-600 hover:text-indigo-600 flex items-center gap-0.5 transition cursor-pointer">
                <span>Tümünü Gör</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/40 transition">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-0.5 border border-purple-100">
                  <Folder size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">Yeni bir proje oluşturuldu: <span className="font-semibold text-purple-900">WorkMix SaaS</span></p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> Bugün</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> 14:32</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/40 transition">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-0.5 border border-indigo-100">
                  <Users size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">Yeni ekip üyesi organizasyona katıldı.</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> Dün</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> 11:15</span>
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