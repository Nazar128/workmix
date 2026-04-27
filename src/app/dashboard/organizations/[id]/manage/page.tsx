import { ManageMembersModal } from "@/components/dashboard/ManagerMembersModal";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function OrgManagePage({ params }: { params: { id: string } }) {
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

  const [orgRes, membersRes, myMembershipRes] = await Promise.all([
    supabase.from("organizations").select("*").eq("id", params.id).single(),
    supabase.from("org_members").select("*, users(id, email, full_name)").eq("org_id", params.id),
    supabase.from("org_members").select("*").eq("org_id", params.id).eq("user_id", user.id).single()
  ]);

  if (!orgRes.data || !myMembershipRes.data) redirect("/dashboard/organizations");

  const org = orgRes.data;
  const members = membersRes.data || [];
  const myMembership = myMembershipRes.data;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{org.name}</h1>
          <p className="text-slate-500 mt-1">Organizasyon Ayarları ve Üye Yönetimi</p>
        </div>
        <ManageMembersModal
          org={org} 
          members={members} 
          currentUserRole={myMembership.org_role}
          isOwner={myMembership.is_owner}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Organizasyon Bilgileri</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Plan</p>
              <p className="font-medium text-slate-900 capitalize">{org.plan}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}