"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { transferOwnership, updateMemberRole, suspendOrganization } from "@/actions/admin";

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
    <div className="space-y-6">
      <button 
        onClick={() => router.back()} 
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        ← Geri Dön
      </button>

      <div className="flex items-center justify-between bg-gray-900 p-6 rounded-xl border border-purple-900/50">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{org.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              org.is_suspended ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
            }`}>
              {org.is_suspended ? "Askıda" : "Aktif"}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">ID: {org.id}</p>
        </div>
        
        <button 
          onClick={handleSuspend} 
          disabled={isPending}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            org.is_suspended 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white"
          } disabled:opacity-50`}
        >
          {org.is_suspended ? "Organizasyonu Aktif Et" : "Organizasyonu Askıya Al"}
        </button>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-purple-900/50">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Sahiplik Yönetimi</h2>
        <div className="flex items-center gap-3">
          <select 
            value={newOwner} 
            onChange={(e) => setNewOwner(e.target.value)} 
            className="bg-gray-800 border border-purple-900 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Yeni sahip seçin...</option>
            {members.filter((m) => !m.is_owner).map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.users?.name || m.users?.email}
              </option>
            ))}
          </select>
          <button 
            onClick={handleTransfer} 
            disabled={!newOwner || isPending}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sahipliği Devret
          </button>
        </div>
      </div>

      <div className="border-b border-purple-900/30">
        <div className="flex gap-8">
          <button 
            onClick={() => setTab("members")} 
            className={`pb-3 text-sm font-medium transition-all ${
              tab === "members" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Üyeler ({members.length})
          </button>
          <button 
            onClick={() => setTab("projects")} 
            className={`pb-3 text-sm font-medium transition-all ${
              tab === "projects" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Projeler ({projects.length})
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-purple-900/50 overflow-hidden">
        {tab === "members" && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-950 text-gray-400 border-b border-purple-900/50">
                <th className="px-6 py-4 font-semibold">İsim</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
                <th className="px-6 py-4 font-semibold text-right">Sahiplik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30 text-gray-300">
              {members.map((m) => (
                <tr key={m.user_id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{m.users?.name || "—"}</td>
                  <td className="px-6 py-4">{m.users?.email || "—"}</td>
                  <td className="px-6 py-4">
                    <select
                      value={m.org_role}
                      onChange={(e) => handleRoleChange(m.user_id, e.target.value)}
                      disabled={isPending || m.is_owner}
                      className="bg-gray-800 border border-purple-900 text-xs rounded px-2 py-1 outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="member">Member</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs ${m.users?.is_active ? "text-green-500" : "text-red-500"}`}>
                      {m.users?.is_active ? "Erişim Var" : "Erişim Yok"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {m.is_owner ? <span className="text-purple-400 font-bold">Kurucu Sahip</span> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "projects" && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-950 text-gray-400 border-b border-purple-900/50">
                <th className="px-6 py-4 font-semibold">Proje Adı</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
                <th className="px-6 py-4 font-semibold text-right">Oluşturulma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30 text-gray-300">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                  <td className="px-6 py-4 uppercase text-xs tracking-widest">{p.status}</td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {new Date(p.created_at).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}