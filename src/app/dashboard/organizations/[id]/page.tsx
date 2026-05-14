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
    <div className="p-8 min-h-screen bg-[#FDFCFE]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <Link
          href={`/dashboard/organizations/${params.id}`}
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-700 font-bold text-sm transition-all group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Geri Dön
        </Link>

        <div className="relative overflow-hidden bg-white/40 backdrop-blur-2xl border border-white/60 p-10 rounded-[3rem] shadow-xl shadow-purple-100/20">
          <div className="absolute top-0 right-0 p-8">
             <div className="flex gap-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter shadow-sm ${
                org.status === "active" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {org.status === "active" ? "Aktif" : "Pasif"}
              </span>
              <span className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-xs font-black uppercase tracking-tighter shadow-sm shadow-purple-200">
                {org.plan}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-purple-200 ring-8 ring-purple-50">
              {org.name[0].toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">{org.name}</h1>
              <p className="text-purple-500 font-mono text-lg font-bold">workmix.com/{org.slug}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Toplam Üye", value: members?.length ?? 0, max: org.max_members, icon: "👥" },
            { label: "Proje Sayısı", value: projects?.length ?? 0, max: org.max_projects, icon: "🚀" },
            { label: "Aktif İşler", value: projects?.filter(p => p.status === "active").length ?? 0, icon: "⚡" },
            { label: "Yetki Seviyesi", value: membership.is_owner ? "Sahip" : membership.org_role === "admin" ? "Yönetici" : "Üye", icon: "💎" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-md border border-purple-50 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">{stat.icon}</span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                {stat.max && <span className="text-sm font-bold text-slate-300">/ {stat.max}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Projeler</h2>
            {isAdmin && (
              <Link
                href="/dashboard/projects"
                className="bg-slate-900 text-white hover:bg-purple-700 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-lg hover:shadow-purple-200"
              >
                + Yeni Proje
              </Link>
            )}
          </div>

          {!projects || projects.length === 0 ? (
            <div className="p-20 bg-white border-2 border-dashed border-purple-100 rounded-[3rem] text-center">
              <p className="text-slate-400 font-bold text-lg">Bu organizasyonda henüz aktif bir proje yok.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-100 transition-all duration-500">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="font-black text-xl text-slate-800 group-hover:text-purple-600 transition-colors">{project.name}</h3>
                    <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      project.status === "active" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      {project.status === "active" ? "Aktif" : "Pasif"}
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      {project.start_date && <span>📅 {new Date(project.start_date).toLocaleDateString("tr-TR")}</span>}
                      <span>{project.visibility === "public" ? "🌍 Açık" : "🔒 Özel"}</span>
                    </div>
                    <Link href={`/dashboard/projects/${project.id}`} className="text-purple-600 font-black text-sm hover:underline">Detay →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight px-4">Ekip Üyeleri</h2>
          <div className="bg-white/70 backdrop-blur-md border border-purple-50 rounded-[3rem] overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 divide-y divide-purple-50">
              {members?.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-6 hover:bg-purple-50/50 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-100 flex items-center justify-center text-purple-700 text-xl font-black shadow-inner">
                      {(member.users?.name || member.users?.email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-800 leading-none mb-1">
                        {member.users?.name || member.users?.email}
                      </p>
                      <p className="text-sm font-bold text-slate-400">{member.users?.email}</p>
                    </div>
                  </div>
                  <div className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border ${
                    member.is_owner ? "border-amber-200 bg-amber-50 text-amber-700" : "border-purple-100 bg-purple-50 text-purple-700"
                  }`}>
                    {member.is_owner ? "👑 Sahip" : member.org_role === "admin" ? "Yönetici" : "Üye"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}