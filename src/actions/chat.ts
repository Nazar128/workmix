"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getUserOrgIds(supabase: any, userId: string): Promise<string[]> {
  const { data: members } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId);

  const orgIds = members?.map((m: any) => m.organization_id).filter(Boolean) || [];

  const { data: userProjects } = await supabase
    .from("projects")
    .select("org_id")
    .eq("created_by", userId);

  if (userProjects) {
    userProjects.forEach((p: any) => {
      if (p.org_id && !orgIds.includes(p.org_id)) {
        orgIds.push(p.org_id);
      }
    });
  }

  return orgIds;
}

export async function sendChatMessage(content: string, imageUrl?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkisiz");

  const orgIds = await getUserOrgIds(supabase, user.id);
  if (orgIds.length === 0) throw new Error("Organizasyon bulunamadı");

  const { error } = await supabase.from("chat_messages").insert({
    content,
    image_url: imageUrl ?? null,
    sender_id: user.id,
    organization_id: orgIds[0]
  });

  if (error) throw error;
  
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateChatMessage(messageId: string | number, content: string) {
  const supabase = await createClient(); 
  const { data: { user }} = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkisiz");

  const orgIds = await getUserOrgIds(supabase, user.id);
  if (orgIds.length === 0) throw new Error("Organizasyon bulunamadı");

  const { data: message } = await supabase
    .from("chat_messages")
    .select("organization_id, sender_id")
    .eq("id", messageId)
    .single();

  if (!message) throw new Error("Mesaj bulunamadı");
  
  const isOwner = message.sender_id === user.id;
  const isInOrg = orgIds.includes(message.organization_id);

  if (!isOwner && !isInOrg) throw new Error("Yetkisiz");
  if (!isOwner) throw new Error("Bu mesajı düzenleme yetkiniz yok");
  
  const { error } = await supabase
    .from("chat_messages")
    .update({ 
      content, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", messageId)
    .eq("sender_id", user.id);

  if (error) throw error;
  
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteChatMessage(messageId: string | number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkisiz");

  const orgIds = await getUserOrgIds(supabase, user.id);
  if (orgIds.length === 0) throw new Error("Organizasyon bulunamadı");
  
  const { data: message } = await supabase
    .from("chat_messages")
    .select("organization_id, sender_id")
    .eq("id", messageId)
    .single();

  if (!message) throw new Error("Mesaj bulunamadı");
  
  const isOwner = message.sender_id === user.id;
  const isInOrg = orgIds.includes(message.organization_id);

  if (!isOwner && !isInOrg) throw new Error("Yetkisiz");
  
  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("id", messageId)
    .eq("sender_id", user.id);

  if (error) throw error;
  
  revalidatePath("/dashboard");
  return { success: true };
}

export async function pinChatMessage(messageId: string | number, pinned: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkisiz");

  const orgIds = await getUserOrgIds(supabase, user.id);
  if (orgIds.length === 0) throw new Error("Organizasyon bulunamadı");

  const { data: userData } = await supabase
    .from("users")
    .select("system_role")
    .eq("id", user.id)
    .single();

  if (!["admin", "manager"].includes(userData?.system_role)) {
    throw new Error("Bu işlem için yetkiniz yok");
  }

  const { error } = await supabase
    .from("chat_messages")
    .update({ pinned })
    .eq("id", messageId);

  if (error) throw error;
  
  revalidatePath("/dashboard");
  return { success: true };
}

export async function uploadChatImage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }} = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkisiz"); 

  const orgIds = await getUserOrgIds(supabase, user.id);
  if (orgIds.length === 0) throw new Error("Organizasyon bulunamadı");
 
  const file = formData.get("file") as File;
  if (!file) throw new Error("Dosya bulunamadı");
 
  const ext = file.name.split(".").pop();
  const path = `chat/${user.id}/${Date.now()}.${ext}`;
 
  const { error } = await supabase.storage
    .from("chat-images")
    .upload(path, file, { upsert: true });
 
  if (error) throw error;
 
  const { data: urlData } = supabase.storage
    .from("chat-images")
    .getPublicUrl(path);
 
  revalidatePath("/dashboard");
  return { url: urlData.publicUrl };
}