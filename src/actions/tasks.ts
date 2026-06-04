"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, user };
}

export async function deleteTask(id: string) {
  const { supabase } = await getClient();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/dashboard/tasks");
}

export async function toggleTaskStatus(id: string, currentStatus: string) {
  const { supabase } = await getClient();
  const newStatus = currentStatus === "done" ? "todo" : "done";
  await supabase.from("tasks").update({ status: newStatus }).eq("id", id);
  revalidatePath("/dashboard/tasks");
}

export async function updateTask(id: string, formData: FormData) {
  const { supabase } = await getClient();
  await supabase.from("tasks").update({
    title: formData.get("title"),
    priority: formData.get("priority"),
    due_date: formData.get("due_date"),
    assignee_id: formData.get("assignee_id")
  }).eq("id", id);
  revalidatePath("/dashboard/tasks");
}

export async function createTask(formData: FormData) {
  const { supabase, user } = await getClient();
  
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  await supabase.from("tasks").insert({
    title: formData.get("title"),
    project_id: formData.get("project_id"),
    priority: formData.get("priority"),
    due_date: formData.get("due_date"),
    created_by: user.id,
    assignee_id: formData.get("assignee_id"),
    organization_id: userProfile?.organization_id,
    status: "todo",
  });
  revalidatePath("/dashboard/tasks");
}