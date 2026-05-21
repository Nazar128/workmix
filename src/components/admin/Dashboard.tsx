import { createClient } from '@/lib/supabase/server';
import AdminCard from './AdminCard';
import { Activity, Building2, FolderKanban, UserPlus, Users, LayoutDashboard } from 'lucide-react';

export default async function Dashboard() {
  const supabase = await createClient();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoISO = oneWeekAgo.toISOString();

  const [
    { count: projectCount },
    { count: memberCount },
    { count: orgCount },
    { count: activeProjectCount },
    { count: newUsersCount }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('organizations').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgoISO)
  ]);

  return (
    <div className="h-72 bg-gradient-to-tr from-[#e2f0fe] via-[#fce8f9] to-[#f3d8fe] p-6 text-slate-800 antialiased font-sans flex flex-col gap-4 ">
      

      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between border-b border-slate-200/60 pb-1">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent uppercase">
              Platform Yönetimi
            </h1>
            <p className="text-[11px] text-slate-400 font-semibold">Canlı sistem istatistikleri ve operasyonel veriler</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Sistem Çevrimiçi
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        <AdminCard
          title="Toplam Kullanıcı"
          value={memberCount ?? 0}
          icon={Users}
          description="Sistemde kayıtlı toplam üye sayısı"
        />
        <AdminCard
          title="Yeni Üyeler"
          value={newUsersCount ?? 0}
          icon={UserPlus}
          description="Son 7 günde eklenen yeni hesaplar"
        />
        <AdminCard
          title="Toplam Proje"
          value={projectCount ?? 0}
          icon={FolderKanban}
          description="Oluşturulmuş tüm aktif/pasif projeler"
        />
        <AdminCard
          title="Aktif Projeler"
          value={activeProjectCount ?? 0}
          icon={Activity}
          description="Üretimi devam eden ve yayında olanlar"
        />
        <AdminCard
          title="Organizasyonlar"
          value={orgCount ?? 0}
          icon={Building2}
          description="Kayıtlı kurumsal partner şirketler"
        />
      </div>
    </div>
  );
}