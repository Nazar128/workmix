"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


export async function getProfile() {
    const supabase = await createClient();
    const { data: {user },} = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();

    if (error) throw error;
    return data;
}

export async function updateProfile(formData: {name: string; phone?: string; bio?: string; job_title?: string; department?: string;}) 
{
    const supabase = await createClient();
    const { data: {user },} = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("users").update({name: formData.name, phone: formData.phone ?? null, bio: formData.bio ?? null, job_title: formData.job_title ?? null, department: formData.department ?? null, updated_at: new Date().toISOString(),}).eq("id", user.id);

    if (error) throw error;
    revalidatePath("/dashboard/profile");
    return { success: true };
}

export async function updateAvatarUrl(avatarUrl: string) {
    const supabase = await createClient();

    const { data: {user},} = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error }= await supabase.from("users").update({ avatar_url: avatarUrl, updated_at: new Date().toISOString()}).eq("id", user.id) ;
    if (error) throw error;
    revalidatePath("/dashboard/profile");
    return { success: true };
}

export async function changePassword(newPassword: string)
{
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });
    if (error) throw error;
    return { success: true };
}