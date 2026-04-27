import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

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
      org_role,
      is_owner,
      organizations (
        id,
        name,
        plan,
        status
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-700">Organizasyonlarım</h1>
          <p className="text-gray-500">Yönettiğiniz veya üyesi olduğunuz ekipler.</p>
        </div>
        <button  className="bg-purple-900 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition">
          + Yeni Organizasyon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!orgMembers || orgMembers.length === 0 ? (
          <div className="col-span-full p-12 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
            Henüz bir organizasyona üye değilsiniz.
          </div>
        ) : (
          orgMembers.map((membership: any) => (
            <div key={membership.organizations.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {membership.organizations.name}
                </h2>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  membership.is_owner ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {membership.is_owner ? "Sahip" : membership.org_role}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600">Plan: {membership.organizations.plan}</p>
                <p className="text-sm text-gray-600">Durum: {membership.organizations.status}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {membership.is_owner || membership.org_role === 'admin' ? (
                  <Link 
                    href={`/dashboard/organizations/${membership.organizations.id}/manage`}
                    className="w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Yönetim Paneli
                  </Link>
                ) : (
                  <button className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg cursor-not-allowed text-sm">
                    Görüntüle
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}