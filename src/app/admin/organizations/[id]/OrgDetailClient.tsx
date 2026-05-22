"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { transferOwnership, updateMemberRole, suspendOrganization } from "@/actions/admin";
import { ArrowLeft, Building2, CheckCircle2, XCircle, Users, Layers, Crown, Mail, Calendar, Loader2, ArrowRightLeft } from "lucide-react";

type Member = {
  user_id: string;
  org_role: string;
  is_owner: boolean;
  joined_at: string;
  users: { id: string; name: string; email: string; is_active: boolean } | null;
};

type Project = { 
  id: string; 
  name: string; 
  status: string; 
  created_at: string 
};

type Org = {
  id: string;
  name: string;
  plan: string;
  status: string;
  is_suspended: boolean;
  suspended_reason: string | null;
  max_members: number;
  max_projects: number;
  created_at: string;
};

interface OrgDetailClientProps {
  data: {
    org: Org;
    members: Member[];
    projects: Project[];
  };
}

export default function OrgDetailClient({ data }: OrgDetailClientProps) {
  const { org, members, projects } = data;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<"members" | "projects">("members");
  const [newOwner, setNewOwner] = useState("");

  const handleRoleChange = (userId: string, role: string) => {
    startTransition(() => updateMemberRole(org.id, userId, role));
  };

  const handleTransfer = () => {
    if (!newOwner) return;
    startTransition(async () => {
      await transferOwnership(org.id, newOwner);
      setNewOwner("");
    });
  };

  const handleSuspend = () => {
    startTransition(() => suspendOrganization(org.id, !org.is_suspended));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gradient-to-br from-purple-50/30 via-slate-50 to-indigo-50/20 min-h-screen text-gray-800 antialiased">
      <div>
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-white bg-white hover:bg-purple-600 px-4 py-2 rounded-xl border border-purple-100 shadow-sm transition-all active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" /> Üst Yönetime Dön
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-md shadow-purple-100/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-600 to-indigo-600" />
        <div className="flex items-center gap-4 pl-2">
          <div className="p-3.5 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl text-purple-600 shadow-inner">
            <Building2 className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{org.name}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-purple-600 text-white shadow-sm shadow-purple-200 uppercase tracking-wider">
                {org.plan}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                org.is_suspended ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}>
                {org.is_suspended ? <XCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {org.is_suspended ? "Askıda" : "Aktif"}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-1.5 bg-slate-50 w-fit px-2 py-0.5 rounded border border-slate-100">ID: {org.id}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSuspend} 
          disabled={isPending}
          className={`w-full md:w-auto px-6 py-3 rounded-xl text-sm font-extrabold transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 border ${
            org.is_suspended 
              ? "bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700 hover:shadow-emerald-100" 
              : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white hover:shadow-rose-100"
          } active:scale-95`}
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {org.is_suspended ? "Organizasyonu Aktif Et" : "Organizasyonu Askıya Al"}
        </button>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-5 pointer-events-none">
          <Crown className="w-64 h-64 text-white" />
        </div>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest">Kurucu Sahip Hakları Transferi</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select 
              value={newOwner} 
              onChange={(e) => setNewOwner(e.target.value)} 
              className="flex-1 max-w-md bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-900/40 font-medium transition-all"
            >
              <option value="" className="bg-slate-900 text-slate-400">Yeni yetkili kurucu seçin...</option>
              {members.filter((m) => !m.is_owner).map((m) => (
                <option key={m.user_id} value={m.user_id} className="bg-slate-900 text-slate-200">
                  {m.users?.name ? `${m.users.name} (${m.users.email})` : m.users?.email}
                </option>
              ))}
            </select>
            <button 
              onClick={handleTransfer} 
              disabled={!newOwner || isPending}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl text-sm font-black hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-orange-950/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Sahipliği Devret
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-purple-100 flex gap-4">
        <button 
          onClick={() => setTab("members")} 
          className={`pb-3.5 px-2 text-sm font-black transition-all flex items-center gap-2 relative group ${
            tab === "members" ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Users className={`w-4 h-4 ${tab === "members" ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"}`} /> 
          Üyeler 
          <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${tab === "members" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-500"}`}>
            {members.length} / {org.max_members}
          </span>
        </button>
        <button 
          onClick={() => setTab("projects")} 
          className={`pb-3.5 px-2 text-sm font-black transition-all flex items-center gap-2 relative group ${
            tab === "projects" ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Layers className={`w-4 h-4 ${tab === "projects" ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"}`} /> 
          Projeler 
          <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${tab === "projects" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-500"}`}>
            {projects.length} / {org.max_projects}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-md shadow-purple-100/20 overflow-hidden">
        {tab === "members" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-purple-100">
                  <th className="px-6 py-4 text-slate-700 font-extrabold">Kullanıcı Bilgisi</th>
                  <th className="px-6 py-4 text-slate-700 font-extrabold">E-Posta Adresi</th>
                  <th className="px-6 py-4 text-slate-700 font-extrabold">Kurum Rolü</th>
                  <th className="px-6 py-4 text-slate-700 font-extrabold">Platform Erişimi</th>
                  <th className="px-6 py-4 text-slate-700 font-extrabold text-right pr-8">Yetki Seviyesi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {members.map((m) => (
                  <tr key={m.user_id} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="px-6 py-4.5 font-bold text-slate-900">{m.users?.name || "—"}</td>
                    <td className="px-6 py-4.5 text-slate-500">
                      <div className="inline-flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs group-hover:bg-white group-hover:border-purple-100 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {m.users?.email || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <select
                        value={m.org_role}
                        onChange={(e) => handleRoleChange(m.user_id, e.target.value)}
                        disabled={isPending || m.is_owner}
                        className="bg-white border border-purple-100 text-purple-950 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all disabled:opacity-60 shadow-sm"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="member">Member</option>
                      </select>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${m.users?.is_active ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                        {m.users?.is_active ? "Aktif Hesap" : "Dondurulmuş"}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right pr-8">
                      {m.is_owner ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl shadow-sm">
                          <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Kurucu Sahip
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-bold">Standart Üye</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "projects" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-purple-100">
                  <th className="px-6 py-4 text-slate-700 font-extrabold">Proje Adı</th>
                  <th className="px-6 py-4 text-slate-700 font-extrabold">Mevcut Durum</th>
                  <th className="px-6 py-4 text-slate-700 font-extrabold text-right pr-8">Sisteme Giriş Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-16 text-sm font-bold text-slate-400 bg-slate-50/30">
                      Bu organizasyona ait henüz bir proje üretilmemiş.
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4.5 font-bold text-slate-900 text-base">{p.name}</td>
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-indigo-50 border border-indigo-100 text-indigo-700 uppercase tracking-wider shadow-sm">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right pr-8">
                        <div className="inline-flex items-center justify-end gap-1.5 text-slate-500 font-bold text-xs bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          {new Date(p.created_at).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}