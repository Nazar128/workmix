import { createClient } from '@/lib/supabase/server';
import AdminCard from './AdminCard';
import { Activity, Building2, FolderKanban, UserPlus, Users } from 'lucide-react';

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
    <div className="p-6">
      <h1 className="text-2xl text-gray-100 font-bold uppercase tracking-tight mb-6">
        Platform Genel Bakış
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <AdminCard
          title="Toplam Kullanıcı"
          value={memberCount ?? 0}
          icon={Users}
          description="Sistemdeki tüm kayıtlı üyeler"
        />
        <AdminCard
          title="Yeni Kullanıcılar (7 gün)"
          value={newUsersCount ?? 0}
          icon={UserPlus}
          description="Son 7 gün içinde kaydolan kullanıcılar"
        />
        <AdminCard
          title="Toplam Proje"
          value={projectCount ?? 0}
          icon={FolderKanban}
          description="Oluşturulan tüm projeler"
        />
        <AdminCard
          title="Aktif Projeler"
          value={activeProjectCount ?? 0}
          icon={Activity}
          description="Şu an devam eden projeler"
        />
        <AdminCard
          title="Organizasyonlar"
          value={orgCount ?? 0}
          icon={Building2}
          description="Kayıtlı kurum ve kuruluşlar"
        />
      </div>
    </div>
  );
}