import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
    <div className="p-2 md:p-8 min-h-screen ">
      <div className="max-w-7xl mx-auto ">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-xl border border-white/60 p-2 md:p-2 rounded-[3rem] shadow-xl shadow-purple-100/20">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-purple-700 ">
            ORGANİZASYON<span className="text-slate-900">LARIM</span>
          </h1>
            <p className="text-slate-500 mt-2 text-sm md:font-medium md:text-lg">
              Yönettiğiniz veya üyesi olduğunuz ekipleri buradan takip edin.
            </p>
          </div>
          <div className="shrink-0 mb-2 transition-transform hover:scale-105 active:scale-95">
            <AddOrganizationModal />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2   gap-4 md:gap-8">
          {!orgMembers || orgMembers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-24 bg-white/50 backdrop-blur-md border-2 border-dashed border-purple-100 rounded-[4rem] text-center">
             
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