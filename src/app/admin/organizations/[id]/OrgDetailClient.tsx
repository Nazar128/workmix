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
    <div className="max-w-7xl mx-auto p-3 xs:p-4 sm:p-6 space-y-5 sm:space-y-8 bg-gradient-to-br from-purple-50/30 via-slate-50 to-indigo-50/20 min-h-screen text-gray-800 antialiased w-full overflow-x-hidden">
      <div className="flex w-full">
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-1.5 text-[11px] xs:text-xs sm:text-sm font-bold text-purple-700 hover:text-white bg-white hover:bg-purple-600 px-2.5 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2 rounded-lg xs:rounded-xl border border-purple-100 shadow-sm transition-all active:scale-[0.98] w-full sm:w-auto justify-center sm:justify-start"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 h-4" /> Üst Yönetime Dön
        </button>
      </div>

      <div className="bg-white p-3 xs:p-4 sm:p-6 rounded-xl xs:rounded-2xl border border-purple-100 shadow-md shadow-purple-100/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 relative overflow-hidden w-full">
        <div className="absolute top-0 left-0 w-full md:w-2 h-1 md:h-full bg-gradient-to-r md:bg-gradient-to-b from-purple-600 to-indigo-600" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto pt-1 md:pt-0">
          <div className="p-2.5 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl text-purple-600 shadow-inner shrink-0 hidden sm:block">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
          <div className="w-full min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-base xs:text-lg sm:text-2xl font-black text-slate-900 tracking-tight break-words max-w-full">{org.name}</h1>
              <div className="flex gap-1 xs:gap-1.5 flex-wrap">
                <span className="inline-flex items-center px-1.5 py-0.5 sm:px-3 sm:py-1 rounded text-[9px] xs:text-[10px] sm:text-xs font-black bg-purple-600 text-white shadow-sm shadow-purple-200 uppercase tracking-wider">
                  {org.plan}
                </span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-bold shadow-sm ${
                  org.is_suspended ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}>
                  {org.is_suspended ? <XCircle className="w-3 h-3 sm:w-3.5 h-3.5 text-rose-500" /> : <CheckCircle2 className="w-3 h-3 sm:w-3.5 h-3.5 text-emerald-500" />}
                  {org.is_suspended ? "Askıda" : "Aktif"}
                </span>
              </div>
            </div>
            <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-50 w-fit px-1.5 py-0.5 rounded border border-slate-100 select-all break-all">ID: {org.id}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSuspend} 
          disabled={isPending}
          className={`w-full md:w-auto px-4 py-2 xs:px-5 xs:py-2.5 sm:px-6 sm:py-3 rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-extrabold transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 border shrink-0 ${
            org.is_suspended 
              ? "bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700 hover:shadow-emerald-100" 
              : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white hover:shadow-rose-100"
          } active:scale-95`}
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {org.is_suspended ? "Organizasyonu Aktif Et" : "Organizasyonu Askıya Al"}
        </button>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-3 xs:p-4 sm:p-6 rounded-xl xs:rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden w-full">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-5 pointer-events-none hidden sm:block">
          <Crown className="w-64 h-64 text-white" />
        </div>
        <div className="space-y-3 sm:space-y-4 relative z-10 w-full">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800">
            <Crown className="w-3.5 h-3.5 sm:w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-[10px] xs:text-xs sm:text-sm font-black text-slate-200 uppercase tracking-widest">Kurucu Sahip Hakları Transferi</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full">
            <select 
              value={newOwner} 
              onChange={(e) => setNewOwner(e.target.value)} 
              className="w-full sm:flex-1 sm:max-w-md bg-slate-800/80 border border-slate-700 text-slate-100 rounded-lg xs:rounded-xl px-2.5 py-2 xs:px-4 xs:py-3 text-[11px] xs:text-xs sm:text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-900/40 font-medium transition-all appearance-none"
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
              className="w-full sm:w-auto px-4 py-2 xs:px-5 xs:py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-black hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-orange-950/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 active:scale-[0.98] shrink-0"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Sahipliği Devret
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-purple-100 flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar w-full tabs-container">
        <button 
          onClick={() => setTab("members")} 
          className={`pb-2.5 px-1 sm:px-2 text-[11px] xs:text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 sm:gap-2 relative group whitespace-nowrap ${
            tab === "members" ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Users className={`w-3.5 h-3.5 sm:w-4 h-4 ${tab === "members" ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"}`} /> 
          Üyeler 
          <span className={`text-[9px] xs:text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-bold ${tab === "members" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-500"}`}>
            {members.length} / {org.max_members}
          </span>
        </button>
        <button 
          onClick={() => setTab("projects")} 
          className={`pb-2.5 px-1 sm:px-2 text-[11px] xs:text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 sm:gap-2 relative group whitespace-nowrap ${
            tab === "projects" ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Layers className={`w-3.5 h-3.5 sm:w-4 h-4 ${tab === "projects" ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"}`} /> 
          Projeler 
          <span className={`text-[9px] xs:text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-bold ${tab === "projects" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-500"}`}>
            {projects.length} / {org.max_projects}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl xs:rounded-2xl border border-purple-100 shadow-md shadow-purple-100/20 overflow-hidden w-full">
        {tab === "members" && (
          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-purple-50 text-left text-xs sm:text-sm table-fixed sm:table-auto">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-purple-100">
                    <th scope="col" className="w-[130px] sm:w-auto px-3 sm:px-6 py-3 text-slate-700 font-extrabold text-[10px] xs:text-xs sm:text-sm">Kullanıcı Bilgisi</th>
                    <th scope="col" className="w-[170px] sm:w-auto px-3 sm:px-6 py-3 text-slate-700 font-extrabold text-[10px] xs:text-xs sm:text-sm">E-Posta Adresi</th>
                    <th scope="col" className="w-[110px] sm:w-auto px-3 sm:px-6 py-3 text-slate-700 font-extrabold text-[10px] xs:text-xs sm:text-sm">Kurum Rolü</th>
                    <th scope="col" className="w-[110px] sm:w-auto px-3 sm:px-6 py-3 text-slate-700 font-extrabold text-[10px] xs:text-xs sm:text-sm">Platform Erişimi</th>
                    <th scope="col" className="w-[120px] sm:w-auto px-3 sm:px-6 py-3 text-slate-700 font-extrabold text-[10px] xs:text-xs sm:text-sm text-right pr-3 sm:pr-8">Yetki Seviyesi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50 bg-transparent">
                  {members.map((m) => (
                    <tr key={m.user_id} className="hover:bg-purple-50/30 transition-colors group">
                      <td className="px-3 sm:px-6 py-3.5 font-bold text-slate-900 truncate max-w-[130px] sm:max-w-none text-[11px] xs:text-xs sm:text-sm">{m.users?.name || "—"}</td>
                      <td className="px-3 sm:px-6 py-3.5 text-slate-500">
                        <div className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 xs:py-1 rounded-lg text-[10px] xs:text-xs group-hover:bg-white group-hover:border-purple-100 transition-colors max-w-full truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" /> <span className="truncate">{m.users?.email || "—"}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3.5">
                        <select
                          value={m.org_role}
                          onChange={(e) => handleRoleChange(m.user_id, e.target.value)}
                          disabled={isPending || m.is_owner}
                          className="bg-white border border-purple-100 text-purple-950 text-[10px] xs:text-xs font-bold rounded-lg px-2 py-1 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all disabled:opacity-60 shadow-sm w-full sm:w-auto appearance-none select-custom"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="member">Member</option>
                        </select>
                      </td>
                      <td className="px-3 sm:px-6 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] xs:text-xs font-bold border ${m.users?.is_active ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                          {m.users?.is_active ? "Aktif Hesap" : "Dondurulmuş"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3.5 text-right pr-3 sm:pr-8 whitespace-nowrap">
                        {m.is_owner ? (
                          <span className="inline-flex items-center gap-1 text-[10px] xs:text-xs font-black text-amber-800 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 px-2 py-0.5 xs:py-1 rounded-lg shadow-sm">
                            <Crown className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" /> Kurucu Sahip
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] xs:text-xs font-bold">Standart Üye</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "projects" && (
          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-purple-50 text-left text-xs sm:text-sm table-fixed sm:table-auto">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-purple-100">
                    <th scope="col" className="w-[150px] sm:w-auto px-3 sm:px-6 py-3 text-slate-700 font-extrabold text-[10px] xs:text-xs sm:text-sm">Proje Adı</th>
                    <th scope="col" className="w-[100px] sm:w-auto px-3 sm:px-6 py-3 text-slate-700 font-extrabold text-[10px] xs:text-xs sm:text-sm">Mevcut Durum</th>
                    <th scope="col" className="w-[140px] sm:w-auto px-3 sm:px-6 py-3 text-slate-700 font-extrabold text-[10px] xs:text-xs sm:text-sm text-right pr-3 sm:pr-8">Sisteme Giriş Tarihi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50 bg-transparent">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-10 sm:py-16 text-[11px] xs:text-xs sm:text-sm font-bold text-slate-400 bg-slate-50/30 px-3">
                        Bu organizasyona ait henüz bir proje üretilmemiş.
                      </td>
                    </tr>
                  ) : (
                    projects.map((p) => (
                      <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="px-3 sm:px-6 py-3.5 font-bold text-slate-900 text-xs sm:text-base truncate max-w-[150px] sm:max-w-none">{p.name}</td>
                        <td className="px-3 sm:px-6 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] xs:text-xs font-black bg-indigo-50 border border-indigo-100 text-indigo-700 uppercase tracking-wider shadow-sm">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3.5 text-right pr-3 sm:pr-8 whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1 text-slate-500 font-bold text-[10px] xs:text-xs bg-slate-50 border border-slate-100 px-2 py-0.5 xs:py-1 rounded-lg">
                            <Calendar className="w-3 h-3 text-purple-400 shrink-0" />
                            <span>
                              {new Date(p.created_at).toLocaleDateString("tr-TR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}