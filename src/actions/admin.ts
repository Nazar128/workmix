"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum bulunamadı");

  const { data } = await supabase
    .from("users")
    .select("system_role")
    .eq("id", user.id)
    .single();

  if (data?.system_role !== "super_admin") throw new Error("Yetkisiz erişim");
  return supabase;
}

export async function getAllOrganizations() {
  const supabase = await requireSuperAdmin();

  const { data, error } = await supabase
    .from("organizations")
    .select(`
      id, name, slug, plan, status, is_suspended,
      max_members, max_projects, created_at,
      org_members(count),
      projects(count)
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getOrgDetail(orgId: string) {
  const supabase = await requireSuperAdmin();

  const [orgRes, membersRes, projectsRes] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, name, slug, plan, status, is_suspended, suspended_reason, max_members, max_projects, created_at")
      .eq("id", orgId)
      .single(),

    supabase
      .from("org_members")
      .select("user_id, org_role, is_owner, joined_at, users(id, name, email, avatar_url, is_active)")
      .eq("org_id", orgId),

    supabase
      .from("projects")
      .select("id, name, status, created_at")
      .eq("org_id", orgId),
  ]);

  if (orgRes.error) throw new Error(orgRes.error.message);
  
  return { 
    org: orgRes.data, 
    members: membersRes.data ?? [], 
    projects: projectsRes.data ?? [] 
  };
}

export async function suspendOrganization(orgId: string, suspend: boolean, reason?: string) {
  const supabase = await requireSuperAdmin();

  const { error: orgError } = await supabase.from("organizations").update({
    is_suspended: suspend,
    suspended_at: suspend ? new Date().toISOString() : null,
    suspended_reason: suspend ? (reason ?? "Yönetici kararı") : null,
    status: suspend ? "suspended" : "active",
  }).eq("id", orgId);

  if (orgError) throw new Error(orgError.message);

  const { data: members } = await supabase
    .from("org_members")
    .select("user_id")
    .eq("org_id", orgId);

  if (members && members.length > 0) {
    const userIds = members.map((m) => m.user_id);
    await supabase.from("users")
      .update({ is_active: !suspend })
      .in("id", userIds);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/organizations/${orgId}`);
}

export async function updateOrgLimits(orgId: string, maxMembers: number, maxProjects: number) {
  const supabase = await requireSuperAdmin();

  const { error } = await supabase.from("organizations")
    .update({ max_members: maxMembers, max_projects: maxProjects })
    .eq("id", orgId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath(`/admin/organizations/${orgId}`);
}

export async function transferOwnership(orgId: string, newOwnerId: string) {
  const supabase = await requireSuperAdmin();

  const { error } = await supabase.rpc("transfer_org_ownership", {
    p_org_id: orgId,
    p_new_owner_id: newOwnerId,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/organizations/${orgId}`);
}

export async function updateMemberRole(orgId: string, userId: string, role: string) {
  const supabase = await requireSuperAdmin();

  const { error } = await supabase.from("org_members")
    .update({ org_role: role })
    .eq("org_id", orgId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/organizations/${orgId}`);
}