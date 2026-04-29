"use client"
import { deleteOrganization, updateOrganization } from "@/actions/organizations";
import { useState } from "react";
import { ManageMembersModal } from "./ManagerMembersModal";
import Link from "next/link";

type Member = {
    id: string; org_role: string; is_owner: boolean; joined_at: string; users: {id: string;
         email: string; name: string| null};
    }

    type Organization = {
        id: string; name: string; slug: string; plan: string; status: string; max_members: number; max_projects: number; created_at: string;
    }

    type Props = {
        org: Organization; members: Member[]; projectCount: number; currentUserRole: string; isOwner: boolean;
    }

    export function OrganizationCard({org, members, projectCount, currentUserRole, isOwner} : Props)
    {
        const [isEditing, setIsEditing] =  useState(false);
        const [isDeleting, setIsDeleting] = useState(false);
        const [error, setError] = useState<string | null>(null);

        const isAdmin = currentUserRole === "admin" || isOwner;
        const memberCount = members.length;
        const usagePercent = Math.round((memberCount / org.max_members) * 100);

        async function handleUpdate(formData: FormData) {
            setError(null);
            try {
                await updateOrganization(org.id, formData);
                setIsEditing(false);
            } catch (e: any) {
                setError(e.message);
            }
        }

        async function  handleDelete() {
           if(!confirm(`"${org.name}" organşzasyonunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
           setIsDeleting(true);
           try {
            await deleteOrganization(org.id);
           } catch(e: any) {
            setError(e.message);
            setIsDeleting(false);
           }
            
        }

        return (
            <div className={`group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${isDeleting ?"opacity-50 pointer-events-none": ""}`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 " />
                    <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3 min-w-20">
                                <div className=" w-10 h-10 rounded-xl bg-gradient-to br from-purple-600 to-indigo-700 flex item-center justify-center text-white font-bold text-base flex-shtink-0">
                                    {org.name[0].toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    {isEditing ? (
                                        <form action = {handleUpdate} className="flex items-center gap-2">
                                            <input name="name" defaultValue={org.name} autoFocus className="text-sm font-semibold border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-40"/>
                                            <button type="submit" className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700">
                                                Kaydet
                                            </button>
                                            <button type="button" onClick={() => setIsEditing(false)} className="text-xs text-slate-500 hover:text-slat-800 px-2 py-1 rounded-lg hover:bg-slate-100">
                                                İptal
                                            </button>
                                        </form> ) : (
                                            <>
                                                <Link href={`/dashboard/organizations/${org.id}`}>
                                                    <h3 className="font-bold text-slate-800 text-base truncate hover:text-indigo-600">
                                                        {org.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs text-slate-400 truncate">/{org.slug}</p>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${org.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500" }`}>
                                        {org.status == "active" ? "Aktif" : "Pasif"}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-medium capitalize">
                                        {org.plan}
                                    </span>
                            </div>
                        </div>
                        { error && (
                            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
                                {error}
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-xs text-slate-400 mb-1">Üyeler</p>
                                <p className="text-lg font-bold text-slate-800">
                                    {memberCount}
                                    <span className="text-xs text-slate-400 font-normal">/ {org.max_members}</span>
                                </p>
                                <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all" style={{width: `${Math.min(usagePercent, 100)}%`}}/>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xi p-3">
                                <p className="text-xs text-slate-400 mb-1">Projeler</p>
                                <p className="text-lg font-bold text-slate-400 mb-1">
                                    {projectCount}
                                    <span className="text-xs test-slate-400 font-normal"> / {org.max_projects}</span>
                                </p>
                                <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-graident-to-r from-blue-400 to-cyan-400 rounded-full transition-all" style={{ width: `${Math.min((projectCount / org.max_projects) * 100, 100)}%`}}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="felx -space-x-2">
                                {members.slice(0,5).map((m) => (
                                    <div key={m.id} title={m.users.name || m.users.email} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                        {(m.users.name || m.users.email)[0].toUpperCase()}
                                    </div>
                                ))}
                                {memberCount > 5 && (
                                    <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-500 text-xs font-bold">
                                        +{memberCount - 5}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-slate-400">
                                {memberCount === 1 ? "1 üye" : `${memberCount} üye`}
                            </span>
                            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${
                                isOwner 
                                ? "bg-amber-100 text-amber-700" : currentUserRole === "admin"
                                ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                            }`}>
                                {isOwner ? "Sahip" : currentUserRole === "admin" ? "Yönetici" : "Üye"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                            <ManageMembersModal org={org} members={members} currentUserRole={currentUserRole} isOwner={isOwner} />
                            {isAdmin && !isEditing && (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:order-slate-400 px-3 py-1.5 rounded-lg transition-all">
                                    Düzenle
                                </button>
                            )}
                             {isOwner && (
                            <button
                            onClick={handleDelete}
                            className="ml-auto flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg transition-all"
                            >
                                🗑 Sil
                            </button>
                            )}
                        </div>
                    </div>
            </div>
        )

    }