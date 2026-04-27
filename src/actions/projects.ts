"use server";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteProject (id: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: { getAll()  { return cookieStore.getAll(); }, setAll() {} },
    });
    const { error } = await supabase.from("projects").delete().eq("id",id);
    if (error) throw new Error(error.message); 
    revalidatePath("/projects");
}


export async function toggleProjectStatus(id: string, currentStatus: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: { getAll()  { return cookieStore.getAll(); }, setAll() {} },
    });

    const newStatus= currentStatus === "active" ? "passive" : "active";
    const { error} = await supabase.from("projects").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/projects");
}



export async function updateProject (id: string,  formData: FormData) {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: { getAll()  { return cookieStore.getAll(); }, setAll() {} },
    });

    const { error } = await supabase.from("projects").update({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        visibility: formData.get("visibility") as string ?? "private",
    }). eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/projects");

}

export async function createProject(formData: FormData) {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLİC_SUPABASE_ANON_KEY!, {
        cookies: { getAll() { return cookieStore.getAll();}, setAll() {} },
    });
    const { data: {user}} = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");
    const { error } = await supabase.from("projects").insert( {
        org_id: formData.get("org_id") as string, 
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        status: "active",
        visibility: "private",
        start_date: formData.get("start_date") || null,
        end_date: formData.get("end_date") || null,
        created_by: user.id,
    });
    if (error) throw new Error(error.message);
    revalidatePath("/projects")
}