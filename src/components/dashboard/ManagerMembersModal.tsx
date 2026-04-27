"use client";

import { useState } from "react";
import { removeMember, updateMemberRole, inviteMember } from "@/actions/organizations";

type Member = {
  id: string;
  org_role: string;
  is_owner: boolean;
  joined_at: string;
  users: { id: string; email: string; full_name: string | null };
};

type Props = {
  org: { id: string; name: string };
  members: Member[];
  currentUserRole: string;
  isOwner: boolean;
};

export function ManageMembersModal({ org, members, currentUserRole, isOwner }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"list" | "invite">("list");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = currentUserRole === "admin" || isOwner;

  async function handleRoleChange(memberId: string, newRole: "admin" | "member") {
    setLoading(memberId);
    setError(null);
    try {
      await updateMemberRole(org.id, memberId, newRole);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleRemove(memberId: string) {
    if (!confirm("Bu üyeyi organizasyondan çıkarmak istiyor musunuz?")) return;
    setLoading(memberId);
    setError(null);
    try {
      await removeMember(org.id, memberId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleInvite(formData: FormData) {
    setError(null);
    try {
      await inviteMember(org.id, formData);
      setTab("list");
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-all"
      >
        <span>👥</span> Üyeler ({members.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold text-lg">{org.name}</h2>
            <p className="text-slate-400 text-sm">Üye Yönetimi</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setTab("list")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "list"
                ? "text-slate-900 border-b-2 border-slate-800"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Üye Listesi
          </button>
          {isAdmin && (
            <button
              onClick={() => setTab("invite")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === "invite"
                  ? "text-slate-900 border-b-2 border-slate-800"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              + Üye Davet Et
            </button>
          )}
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {tab === "list" && (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                      {(member.users.full_name || member.users.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {member.users.full_name || member.users.email}
                      </p>
                      <p className="text-xs text-slate-500">{member.users.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.is_owner ? (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                        👑 Sahip
                      </span>
                    ) : isAdmin && !member.is_owner ? (
                      <select
                        value={member.org_role}
                        disabled={loading === member.id}
                        onChange={(e) =>
                          handleRoleChange(member.id, e.target.value as "admin" | "member")
                        }
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
                      >
                        <option value="admin">Yönetici</option>
                        <option value="member">Üye</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.org_role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-200 text-slate-600"
                      }`}>
                        {member.org_role === "admin" ? "Yönetici" : "Üye"}
                      </span>
                    )}

                    {isAdmin && !member.is_owner && (
                      <button
                        onClick={() => handleRemove(member.id)}
                        disabled={loading === member.id}
                        className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {loading === member.id ? "..." : "Çıkar"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-center text-slate-400 py-8 text-sm">Henüz üye yok.</p>
              )}
            </div>
          )}

          {tab === "invite" && isAdmin && (
            <form action={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="kullanici@ornek.com"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Rol</label>
                <select
                  name="role"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="member">Üye</option>
                  <option value="admin">Yönetici</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  Yöneticiler üye ekleyip çıkarabilir, projeleri yönetebilir.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTab("list")}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Davet Gönder
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}