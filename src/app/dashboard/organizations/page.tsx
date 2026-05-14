import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddOrganizationModal from "@/components/dashboard/AddOrganizationModal";
import { OrganizationCard } from "@/components/dashboard/OrganizationCard";

export default async function OrganizationsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orgMembers, error } = await supabase
    .from("org_members")
    .select(`
      org_id,
      org_role,
      is_owner,
      organizations (
        id,
        name,
        slug,
        plan,
        status,max_members, max_projects, created_at
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
  }

  const orgIds = orgMembers?.map((m) => m.org_id) ?? [];

  const { data: allMembers } = await supabase.from("org_members").select(`id, org_id, org_role, is_owner, joined_at, users(id,email,name)`)
  .in("org_id", orgIds.length > 0 ? orgIds : ["00000000-0000-0000-0000-000000000000"]);

  return (
    <div className="p-8 min-h-screen bg-[#FDFCFE]">
      <div className="max-w-7xl mx-auto ">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-xl border border-white/60 p-2 rounded-[3rem] shadow-xl shadow-purple-100/20">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
              ORGANİZASYONLARIM
            </h1>
            <p className="text-slate-500 mt-2 font-medium text-lg">
              Yönettiğiniz veya üyesi olduğunuz ekipleri buradan takip edin.
            </p>
          </div>
          <div className="shrink-0 transition-transform hover:scale-105 active:scale-95">
            <AddOrganizationModal />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!orgMembers || orgMembers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-24 bg-white/50 backdrop-blur-md border-2 border-dashed border-purple-100 rounded-[4rem] text-center">
              <div className="w-24 h-24 bg-purple-50 rounded-[2rem] flex items-center justify-center text-4xl mb-6 shadow-inner">
                🏢
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
                Henüz bir organizasyon yok
              </h2>
              <p className="text-slate-400 text-lg max-w-sm mb-8 font-medium">
                Ekibinizle çalışmaya başlamak için bir organizasyon oluşturun veya var olan birine katılın.
              </p>
              <div className="transition-transform hover:scale-105">
                <AddOrganizationModal />
              </div>
            </div>
          ) : (
            orgMembers.map((membership: any) => {
              const org = membership.organizations as any;
              if (!org) return null;

              const Members = (allMembers ?? []).filter((m) => m.org_id === org.id);
              const orgProjectCount = (allMembers ?? []).filter((p) => p.org_id === org.id).length;

              return (
                <div 
                  key={org.id} 
                  className="group relative transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  
                  <div className="relative bg-white border border-slate-100 rounded-[2.5rem] shadow-sm group-hover:shadow-2xl group-hover:shadow-purple-200/50 transition-all duration-500 h-full overflow-hidden">
                    <OrganizationCard
                      org={org}
                      members={Members as any}
                      projectCount={orgProjectCount}
                      currentUserRole={membership.org_role}
                      isOwner={membership.is_owner}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}