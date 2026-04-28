import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function OrganizationDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_role, is_owner")
    .eq("org_id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!membership) notFound();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug, plan, status, max_members, max_projects, created_at")
    .eq("id", params.id)
    .single();

  if (!org) notFound();

  const { data: members } = await supabase
    .from("org_members")
    .select("id, org_role, is_owner, joined_at, users(id, email, name)")
    .eq("org_id", params.id);

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, status, visibility, start_date, end_date, created_at")
    .eq("org_id", params.id)
    .order("created_at", { ascending: false });

  const isAdmin = membership.org_role === "admin" || membership.is_owner;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/organizations"
          className="text-slate-400 hover:text-slate-700 text-sm transition-colors"
        >
          ← Organizasyonlar
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl">
            {org.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{org.name}</h1>
            <p className="text-slate-400 text-sm">/{org.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            org.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}>
            {org.status === "active" ? "Aktif" : "Pasif"}
          </span>
          <span className="text-xs px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-medium capitalize">
            {org.plan}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Üye", value: members?.length ?? 0, max: org.max_members, color: "purple" },
          { label: "Proje", value: projects?.length ?? 0, max: org.max_projects, color: "indigo" },
          { label: "Aktif Proje", value: projects?.filter(p => p.status === "active").length ?? 0, max: null, color: "emerald" },
          { label: "Rolünüz", value: membership.is_owner ? "Sahip" : membership.org_role === "admin" ? "Yönetici" : "Üye", max: null, color: "amber" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">
              {stat.value}
              {stat.max && (
                <span className="text-sm text-slate-400 font-normal"> / {stat.max}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Projeler</h2>
          {isAdmin && (
            <Link
              href="/dashboard/projects"
              className="text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              + Proje Ekle
            </Link>
          )}
        </div>

        {!projects || projects.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
            Bu organizasyonda henüz proje yok.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">{project.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    project.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {project.status === "active" ? "Aktif" : "Pasif"}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {project.start_date && (
                    <span>📅 {new Date(project.start_date).toLocaleDateString("tr-TR")}</span>
                  )}
                  {project.end_date && (
                    <span>🏁 {new Date(project.end_date).toLocaleDateString("tr-TR")}</span>
                  )}
                  <span className="ml-auto capitalize">{project.visibility}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Üyeler ({members?.length ?? 0})
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {members?.map((member: any, index: number) => (
            <div
              key={member.id}
              className={`flex items-center justify-between p-4 ${
                index !== (members.length - 1) ? "border-b border-slate-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {(member.users?.name || member.users?.email || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {member.users?.name || member.users?.email}
                  </p>
                  <p className="text-xs text-slate-400">{member.users?.email}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                member.is_owner
                  ? "bg-amber-100 text-amber-700"
                  : member.org_role === "admin"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-500"
              }`}>
                {member.is_owner ? "👑 Sahip" : member.org_role === "admin" ? "Yönetici" : "Üye"}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}