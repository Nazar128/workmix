"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} },
  });
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/tasks");
}

export async function toggleTaskStatus(id: string, currentStatus: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} },
  });
  const newStatus = currentStatus === "done" ? "todo" : "done";
  await supabase.from("tasks").update({ status: newStatus }).eq("id", id);
  revalidatePath("/tasks");
}

export async function updateTask(id: string, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} },
  });
  await supabase.from("tasks").update({
    title: formData.get("title"),
    priority: formData.get("priority"),
    due_date: formData.get("due_date"),
  }).eq("id", id);
  revalidatePath("/tasks");
}

export async function createTask(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await supabase.from("tasks").insert({
    title: formData.get("title"),
    project_id: formData.get("project_id"),
    priority: formData.get("priority"),
    due_date: formData.get("due_date"),
    created_by: user.id,
    assignee_id: user.id,
    status: "todo"
  });
  revalidatePath("/tasks");
}