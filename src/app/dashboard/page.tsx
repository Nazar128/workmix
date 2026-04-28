
import { Folder, Users, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/dashboard/Statcards";

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
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
    </div>
  );
}