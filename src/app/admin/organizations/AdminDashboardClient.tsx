"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { suspendOrganization, updateOrgLimits } from "@/actions/admin";

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
        <div>
            <h1 className="text-xl font-semibold mb-6">Organizasyonlar ({orgs.length})</h1>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b text-left text-gray-500">
                        <th className="pb-2 pr-4">İsim</th>
                        <th className="pb-2 pr-4">Plan</th>
                        <th className="pb-2 pr-4">Üye / Limit</th>
                        <th className="pb-2 pr-4">Proje / Limit</th>
                        <th className="pb-2 pr-4">Durum</th>
                        <th className="pb-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {orgs.map((org) => {
                        const memberCount = org.org_members[0]?.count ?? 0;
                        const projectCount = org.projects[0]?.count ?? 0;
                        const isEditing = editingLimits?.id === org.id;

                        return (
                            <tr key={org.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 pr-4 font-medium">{org.name}</td>
                                <td className="py-3 pr-4 text-gray-500">{org.plan}</td>
                                <td className="py-3 pr-4">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editingLimits.maxMembers}
                                            onChange={(e) => setEditingLimits({ ...editingLimits, maxMembers: +e.target.value })}
                                            className="w-16 border rounded px-1 py-0.5 text-sm"
                                        />
                                    ) : (
                                        <span>{memberCount} / {org.max_members}</span>
                                    )}
                                </td>
                                <td className="py-3 pr-4">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editingLimits.maxProjects}
                                            onChange={(e) => setEditingLimits({ ...editingLimits, maxProjects: +e.target.value })}
                                            className="w-16 border rounded px-1 py-0.5 text-sm"
                                        />
                                    ) : (
                                        <span>{projectCount} / {org.max_projects}</span>
                                    )}
                                </td>
                                <td className="py-3 pr-4">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${org.is_suspended ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                                        {org.is_suspended ? "Askıda" : "Aktif"}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={handleLimitSave} disabled={isPending} className="text-xs text-green-600 hover:underline">Kaydet</button>
                                                <button onClick={() => setEditingLimits(null)} className="text-xs text-gray-500 hover:underline">İptal</button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setEditingLimits({ id: org.id, maxMembers: org.max_members, maxProjects: org.max_projects })}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                Limit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleSuspend(org)}
                                            disabled={isPending}
                                            className={`text-xs hover:underline ${org.is_suspended ? "text-green-600" : "text-red-600"}`}
                                        >
                                            {org.is_suspended ? "Aktif Et" : "Askıya Al"}
                                        </button>
                                        <Link
                                            href={`/admin/organizations/${org.id}`}
                                            className="text-xs text-gray-600 hover:underline"
                                        >
                                            Detay →
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}