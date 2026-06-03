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
    <div className="h-auto bg-gradient-to-tr from-[#e2f0fe] via-[#fce8f9] to-[#f3d8fe] mt-4 p-4 sm:p-6 text-slate-800 antialiased font-sans flex flex-col gap-4 relative overflow-hidden rounded-2xl w-full">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/10 shrink-0">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent uppercase truncate">
              Platform Yönetimi
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-semibold truncate">Canlı sistem istatistikleri ve operasyonel veriler</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm shrink-0 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Sistem Çevrimiçi
        </div>
      </div>

      <div className="relative z-10 flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 sm:gap-5 pb-3 lg:pb-0 no-scrollbar snap-x snap-mandatory scroll-smooth w-full -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex-shrink-0 w-[260px] sm:w-[290px] lg:w-full snap-start">
          <AdminCard
            title="Toplam Kullanıcı"
            value={memberCount ?? 0}
            icon={Users}
            description="Sistemde kayıtlı toplam üye sayısı"
          />
        </div>
        <div className="flex-shrink-0 w-[260px] sm:w-[290px] lg:w-full snap-start">
          <AdminCard
            title="Yeni Üyeler"
            value={newUsersCount ?? 0}
            icon={UserPlus}
            description="Son 7 günde eklenen yeni hesaplar"
          />
        </div>
        <div className="flex-shrink-0 w-[260px] sm:w-[290px] lg:w-full snap-start">
          <AdminCard
            title="Toplam Proje"
            value={projectCount ?? 0}
            icon={FolderKanban}
            description="Oluşturulmuş tüm aktif/pasif projeler"
          />
        </div>
        <div className="flex-shrink-0 w-[260px] sm:w-[290px] lg:w-full snap-start">
          <AdminCard
            title="Aktif Projeler"
            value={activeProjectCount ?? 0}
            icon={Activity}
            description="Üretimi devam eden ve yayında olanlar"
          />
        </div>
        <div className="flex-shrink-0 w-[260px] sm:w-[290px] lg:w-full snap-start">
          <AdminCard
            title="Organizasyonlar"
            value={orgCount ?? 0}
            icon={Building2}
            description="Kayıtlı kurumsal partner şirketler"
          />
        </div>
      </div>
    </div>
  );
}