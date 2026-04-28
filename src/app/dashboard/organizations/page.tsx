import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddOrganizationModal from "@/components/dashboard/AddOrganizationModal";
import {OrganizationCard} from "@/components/dashboard/OrganizationCard";

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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-700">Organizasyonlarım</h1>
          <p className="text-gray-500">Yönettiğiniz veya üyesi olduğunuz ekipler.</p>
        </div>
        <AddOrganizationModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!orgMembers || orgMembers.length === 0 ? (
          <div className="col-span-full p-12 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
            Henüz bir organizasyona üye değilsiniz.
                     <p className="text-slate-400 text-sm max-w-xs mb-6">
            Ekibinizle çalışmaya başlamak için bir organizasyon oluşturun veya var olan birine katılın.
          </p>
          <AddOrganizationModal />
          </div>
        ) : (
          orgMembers.map((membership: any) => {
            
                const org = membership.organizations as any;
            if (!org) return null;
 
            const Members = (allMembers ?? []).filter((m) => m.org_id === org.id);
            const orgProjectCount = (allMembers ?? []).filter((p) => p.org_id === org.id).length;
 
            return (
              <OrganizationCard
                key={org.id}
                org={org}
                members={Members as any}
                projectCount={orgProjectCount}
                currentUserRole={membership.org_role}
                isOwner={membership.is_owner}
              />
            );
       
          }))
        }
      </div>
    </div>
  )
}