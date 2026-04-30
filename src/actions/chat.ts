"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendChatMessage(content: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkisiz");

  const { data: userData } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!userData?.organization_id) throw new Error("Organizasyon bulunamadı");

  const { error } = await supabase.from("chat_messages").insert({
    content,
    sender_id: user.id,
    organization_id: userData.organization_id
  });

  if (error) throw error;
  return { success: true };
}