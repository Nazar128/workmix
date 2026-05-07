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

export async function getAnnouncements() {
  const supabase = await requireSuperAdmin();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getActiveAnnouncements() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createAnnouncement(
  title: string,
  message: string,
  type: string,
  expiresAt?: string
) {
  const supabase = await requireSuperAdmin();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("announcements").insert({
    title,
    message,
    type,
    is_active: true,
    created_by: user!.id,
    expires_at: expiresAt || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/announcements");
}

export async function toggleAnnouncement(id: string, isActive: boolean) {
  const supabase = await requireSuperAdmin();

  const { error } = await supabase
    .from("announcements")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/announcements");
}

export async function deleteAnnouncement(id: string) {
  const supabase = await requireSuperAdmin();

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/announcements");
}