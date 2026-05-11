"use server";


import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSystemSettingsAction(column: string, value: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("system_settings")
    .update({ [column]: value, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    console.error("Update error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}