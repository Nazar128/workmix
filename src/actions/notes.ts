"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createNote(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Yetkisiz erişim");

  const title = formData.get("title") as string;
  const project_id = formData.get("project_id") as string || null;
  const content = formData.get("content");

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    project_id: project_id === "" ? null : project_id,
    title,
    content: content ? JSON.parse(content as string) : {},
    category: "Genel"
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/projects");
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Yetkisiz erişim");

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/projects");
}

export async function updateNote(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Yetkisiz erişim");

  const title = formData.get("title") as string;
  const content = formData.get("content");

  const { error } = await supabase
    .from("notes")
    .update({
      title,
      content: content ? JSON.parse(content as string) : {},
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/projects");
}