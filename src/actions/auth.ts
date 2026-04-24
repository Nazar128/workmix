"use server"
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/types/schemas/auth.schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



export type ActionResult  = 
{
    success: boolean;
    message: string;
}

export async function signIn(formData: FormData): Promise<ActionResult> {
    const rawData = { 
        email: formData.get("email") as String,
        password: formData.get("password") as string

    }
    const validation = signInSchema.safeParse(rawData);
    if(!validation.success)
    {
        const firstError = validation.error.issues[0]?.message;
        return { success: false, message : firstError ?? "Geçersiz form verisi"}
    }
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password,
    });

    if (error) {
        console.log("Supabase hata mesajı:", error.message);
         const errorMap: Record<string, string> = {
      "Invalid login credentials": "E-posta veya şifre hatalı.",
      "Email not confirmed": "E-posta adresinizi doğrulamanız gerekmektedir.",
      "Too many requests": "Çok fazla deneme yaptınız. Lütfen bekleyiniz.",
    };

    const message = errorMap[error.message] ?? "Giriş yapılırken bir hata oluştu.";
    return { success: false, message};

    }
    revalidatePath("/","layout");
    redirect("/dashboard");

}

export async function signUp(formData: FormData): Promise<ActionResult> {
    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const validation = signUpSchema.safeParse(rawData);
    if (!validation.success) {
        const firstError = validation.error.issues[0]?.message;
        return { success: false, message: firstError ?? "Geçersiz form verisi" };
    }

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
            data: {
                name: validation.data.name,
            },
        },
    });

    if (authError) {
        const errorMap: Record<string, string> = {
            "User already registered": "Bu e-posta adresi zaten kayıtlı.",
            "Password should be at least 8 characters": "Şifre en az 8 karakter olmalıdır.",
        };
        const message = errorMap[authError.message] ?? "Kayıt olurken bir hata oluştu.";
        return { success: false, message };
    }

    if (!authData.session) {
        return {
            success: true,
            message: "Kayıt başarılı! Lütfen e-posta adresinizi doğrulayınız.",
        };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/","layout");
    redirect("/login");
}