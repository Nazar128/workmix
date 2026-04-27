"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function createOrganization(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = generateSlug(name) + "-" + Math.random().toString(36).slice(2, 6);

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name,
      slug,
      plan: "free",
      status: "active",
      max_members: 10,
      max_projects: 5,
    })
    .select()
    .single();

  if (orgError) throw new Error(orgError.message);

  const { error: memberError } = await supabase.from("org_members").insert({
    org_id: org.id,
    user_id: user.id,
    org_role: "admin",
    is_owner: true,
  });

  if (memberError) throw new Error(memberError.message);

  revalidatePath("/dashboard/organizations");
}

export async function deleteOrganization(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: membership } = await supabase
    .from("org_members")
    .select("is_owner")
    .eq("org_id", id)
    .eq("user_id", user.id)
    .single();

  if (!membership?.is_owner) throw new Error("Yalnızca organizasyon sahibi silebilir.");

  const { error } = await supabase.from("organizations").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/organizations");
}

export async function updateOrganization(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_role, is_owner")
    .eq("org_id", id)
    .eq("user_id", user.id)
    .single();

  if (!membership || (membership.org_role !== "admin" && !membership.is_owner)) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }

  const { error } = await supabase
    .from("organizations")
    .update({
      name: formData.get("name") as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/organizations");
}


export async function inviteMember(orgId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: callerMembership } = await supabase
    .from("org_members")
    .select("org_role, is_owner")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (!callerMembership || callerMembership.org_role === "member") {
    throw new Error("Üye davet etmek için admin yetkisi gerekli.");
  }

  const email = formData.get("email") as string;
  const { data: targetUser, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (userError || !targetUser) throw new Error("Kullanıcı bulunamadı.");

  const { data: existing } = await supabase
    .from("org_members")
    .select("id")
    .eq("org_id", orgId)
    .eq("user_id", targetUser.id)
    .single();

  if (existing) throw new Error("Bu kullanıcı zaten organizasyonda.");

  const { error } = await supabase.from("org_members").insert({
    org_id: orgId,
    user_id: targetUser.id,
    org_role: (formData.get("role") as string) ?? "member",
    is_owner: false,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/organizations");
}

export async function updateMemberRole(
  orgId: string,
  memberId: string,
  newRole: "admin" | "member"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: callerMembership } = await supabase
    .from("org_members")
    .select("org_role, is_owner")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (!callerMembership || callerMembership.org_role === "member") {
    throw new Error("Rol değiştirmek için admin yetkisi gerekli.");
  }

  const { error } = await supabase
    .from("org_members")
    .update({ org_role: newRole })
    .eq("id", memberId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/organizations");
}

export async function removeMember(orgId: string, memberId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: targetMember } = await supabase
    .from("org_members")
    .select("is_owner, user_id")
    .eq("id", memberId)
    .single();

  if (targetMember?.is_owner) throw new Error("Organizasyon sahibi kaldırılamaz.");

  const isSelf = targetMember?.user_id === user.id;
  if (!isSelf) {
    const { data: callerMembership } = await supabase
      .from("org_members")
      .select("org_role")
      .eq("org_id", orgId)
      .eq("user_id", user.id)
      .single();

    if (callerMembership?.org_role !== "admin") {
      throw new Error("Üye çıkarmak için admin yetkisi gerekli.");
    }
  }

  const { error } = await supabase.from("org_members").delete().eq("id", memberId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/organizations");
}