"use client";
import { deleteOrganization, updateOrganization } from "@/actions/organizations";
import { useState } from "react";
import { ManageMembersModal } from "./ManagerMembersModal";
import Link from "next/link";
import { ChevronRight, Settings2, Trash2, Check, X, Layout, Users, Zap } from "lucide-react";

type Member = {
  id: string;
  org_role: string;
  is_owner: boolean;
  joined_at: string;
  users: { id: string; email: string; name: string | null };
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  max_members: number;
  max_projects: number;
  created_at: string;
};

type Props = {
  org: Organization;
  members: Member[];
  projectCount: number;
  currentUserRole: string;
  isOwner: boolean;
};

export function OrganizationCard({ org, members, projectCount, currentUserRole, isOwner }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = currentUserRole === "admin" || isOwner;
  const memberCount = members.length;

  async function handleUpdate(formData: FormData) {
    setError(null);
    try {
      await updateOrganization(org.id, formData);
      setIsEditing(false);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete() {
    if (!confirm(`"${org.name}" organizasyonunu silmek istediğinize emin misiniz?`)) return;
    setIsDeleting(true);
    try {
      await deleteOrganization(org.id);
    } catch (e: any) {
      setError(e.message);
      setIsDeleting(false);
    }
  }

  return (
    <div className={`group relative rounded-[3rem] p-[2px] transition-all duration-700 hover:scale-[1.03] ${isDeleting ? "opacity-40 grayscale pointer-events-none" : ""}`}>
      
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-purple-400 via-indigo-500 to-fuchsia-500 opacity-20 group-hover:opacity-100 blur-sm transition-opacity duration-700" />

      <div className="relative bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[3rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] overflow-hidden h-full">
        
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors" />
        
        <Link 
          href={`/dashboard/organizations/${org.id}`}
          className="absolute top-8 right-8 z-10 p-3 rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500 hover:bg-purple-700"
        >
          <ChevronRight size={20} />
        </Link>

        <div className="p-10">
          <div className="flex items-center gap-6 mb-10">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-20 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-16 h-16 rounded-[1.8rem] bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-xl ring-4 ring-white/50">
                {org.name[0].toUpperCase()}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <form action={handleUpdate} className="flex items-center gap-2">
                  <input
                    name="name"
                    defaultValue={org.name}
                    autoFocus
                    className="text-xl font-black bg-white/80 border-b-2 border-purple-500 outline-none w-full px-2 py-1 rounded-t-lg"
                  />
                  <button type="submit" className="text-emerald-600 p-2 hover:bg-emerald-50 rounded-xl"><Check size={22} /></button>
                  <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-xl"><X size={22} /></button>
                </form>
              ) : (
                <div className="space-y-1">
                  <Link href={`/dashboard/organizations/${org.id}`}>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight truncate hover:text-purple-600 transition-colors">
                      {org.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400 leading-none">
                      {org.slug}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Live</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-6 rounded-[2.2rem] bg-gradient-to-b from-purple-50/50 to-white border border-purple-100 shadow-sm group-hover:border-purple-300 transition-all">
              <div className="flex items-center gap-2 mb-3 text-purple-400">
                <Users size={14} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Ekip</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 leading-none">{memberCount}</span>
                <span className="text-xs font-bold text-purple-300">/ {org.max_members}</span>
              </div>
            </div>

            <div className="p-6 rounded-[2.2rem] bg-gradient-to-b from-indigo-50/50 to-white border border-indigo-100 shadow-sm group-hover:border-indigo-300 transition-all">
              <div className="flex items-center gap-2 mb-3 text-indigo-400">
                <Layout size={14} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Proje</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 leading-none">{projectCount}</span>
                <span className="text-xs font-bold text-indigo-300">/ {org.max_projects}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pb-8">
            <div className="flex -space-x-3">
              {members.slice(0, 3).map((m) => (
                <div 
                  key={m.id} 
                  className="w-11 h-11 rounded-2xl border-[3px] border-white bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 shadow-md group-hover:-translate-y-2 transition-transform duration-500"
                >
                  {(m.users.name || m.users.email)[0].toUpperCase()}
                </div>
              ))}
              {memberCount > 3 && (
                <div className="w-11 h-11 rounded-2xl border-[3px] border-white bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-[11px] font-black text-white shadow-md">
                  +{memberCount - 3}
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-slate-200">
                <Zap size={10} className="text-amber-400 fill-amber-400" />
                {org.plan}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-8 border-t border-slate-100/60">
            <div className="flex-1">
              <ManageMembersModal org={org} members={members} currentUserRole={currentUserRole} isOwner={isOwner} />
            </div>
            
            <div className="flex items-center gap-2">
              {isAdmin && !isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="p-3.5 rounded-2xl bg-white text-slate-400 hover:text-purple-600 border border-slate-100 hover:border-purple-200 hover:bg-purple-50 shadow-sm transition-all active:scale-90"
                >
                  <Settings2 size={18} />
                </button>
              )}
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="p-3.5 rounded-2xl bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 border border-slate-100 hover:border-red-100 shadow-sm transition-all active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="absolute bottom-6 left-10 right-10 text-[11px] font-black text-white bg-red-500 p-3 rounded-2xl text-center shadow-xl shadow-red-200 animate-in zoom-in-95">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}