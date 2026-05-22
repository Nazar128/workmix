"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { suspendOrganization, updateOrgLimits } from "@/actions/admin";
import { ShieldAlert, Users, Layers, CheckCircle2, XCircle, ArrowUpRight, Settings2, Save, X, Loader2 } from "lucide-react";

type Org = {
    id: string; name: string; slug: string; plan: string;
    status: string; is_suspended: boolean;
    max_members: number; max_projects: number; created_at: string;
    org_members: { count: number }[];
    projects: { count: number }[];
};

export default function AdminDashboardClient({ orgs }: { orgs: Org[] }) {
    const [isPending, startTransition] = useTransition();
    const [editingLimits, setEditingLimits] = useState<{ id: string; maxMembers: number; maxProjects: number } | null>(null);

    const handleSuspend = (org: Org) => {
        startTransition(() => suspendOrganization(org.id, !org.is_suspended));
    };

    const handleLimitSave = () => {
        if (!editingLimits) return;
        startTransition(async () => {
            await updateOrgLimits(editingLimits.id, editingLimits.maxMembers, editingLimits.maxProjects);
            setEditingLimits(null);
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-200">
                <div>
                    <h1 className="text-4xl font-medium text-violet-800 tracking-tight flex items-center gap-3">
                        <ShieldAlert className="w-7 h-7 text-purple-600" />
                        ORGANİZASYON <span className=" font-medium text-3xl text-slate-500">YÖNETİMİ</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Sistemdeki tüm organizasyonları, limitleri ve erişim durumlarını buradan kontrol edebilirsiniz.</p>
                </div>
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-2xl text-sm font-bold border border-purple-100 shadow-sm flex items-center gap-2">
                    Toplam Kurum: <span className="text-base font-black">{orgs.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xl shadow-violet-400 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left  border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-b from-violet-800 to-violet-200  text-gray-600 font-semibold">
                                <th className="px-6 py-4 font-bold text-gray-700">İsim / Organizasyon</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Mevcut Plan</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Üye Durumu</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Proje Durumu</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Durum</th>
                                <th className="px-6 py-4 text-right pr-8 font-bold text-gray-700">Aksiyonlar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orgs.map((org) => {
                                const memberCount = org.org_members[0]?.count ?? 0;
                                const projectCount = org.projects[0]?.count ?? 0;
                                const isEditing = editingLimits?.id === org.id;

                                return (
                                    <tr key={org.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4.5">
                                            <div className="font-semibold text-gray-900">{org.name}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">@{org.slug}</div>
                                        </td>
                                        <td className="px-6 py-4.5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200/60 uppercase tracking-wider">
                                                {org.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4.5 text-gray-600">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-purple-400 shrink-0" />
                                                    <input
                                                        type="number"
                                                        value={editingLimits.maxMembers}
                                                        onChange={(e) => setEditingLimits({ ...editingLimits, maxMembers: +e.target.value })}
                                                        className="w-20 border border-purple-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 font-medium transition-all"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">{memberCount}</span>
                                                    <span className="text-gray-400">/</span>
                                                    <span className="text-gray-500 text-xs">{org.max_members}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4.5 text-gray-600">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                                                    <input
                                                        type="number"
                                                        value={editingLimits.maxProjects}
                                                        onChange={(e) => setEditingLimits({ ...editingLimits, maxProjects: +e.target.value })}
                                                        className="w-20 border border-purple-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 font-medium transition-all"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">{projectCount}</span>
                                                    <span className="text-gray-400">/</span>
                                                    <span className="text-gray-500 text-xs">{org.max_projects}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4.5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${org.is_suspended ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                                                {org.is_suspended ? (
                                                    <>
                                                        <XCircle className="w-3.5 h-3.5" /> Askıda
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4.5 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <button 
                                                            onClick={handleLimitSave} 
                                                            disabled={isPending} 
                                                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                                                            title="Kaydet"
                                                        >
                                                            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                        </button>
                                                        <button 
                                                            onClick={() => setEditingLimits(null)} 
                                                            className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                                                            title="İptal"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setEditingLimits({ id: org.id, maxMembers: org.max_members, maxProjects: org.max_projects })}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:text-purple-700 hover:border-purple-200 hover:bg-purple-50 rounded-xl text-xs font-semibold transition-all"
                                                    >
                                                        <Settings2 className="w-3.5 h-3.5" />
                                                        Limitler
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleSuspend(org)}
                                                    disabled={isPending}
                                                    className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold transition-all disabled:opacity-50 ${org.is_suspended ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white" : "bg-red-50 border-red-100 text-red-600 hover:bg-red-600 hover:text-white"}`}
                                                >
                                                    {org.is_suspended ? "Aktif Et" : "Askıya Al"}
                                                </button>

                                                <Link
                                                    href={`/admin/organizations/${org.id}`}
                                                    className="inline-flex items-center gap-0.5 px-2.5 py-1.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-xs font-semibold shadow-sm transition-all"
                                                >
                                                    Detay <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}