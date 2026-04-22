import z from "zod";

export const signInSchema = z.object ({
    email: z.string().min(1, "E-posta adresi gereklidir.").email("E-posta adresi gereklidir."),
    password: z.string().min(1, "Şifre gereklidir.") .min(8, "Şifre en az 8 karakter olmalıdır."),
})


export const signUpSchema = z.object({

    name: z.string().min(1, "Ad Soyad gereklidir.").min(2, "Ad Soyad için en az 2 karakter girmelisiniz").max(100,"Ad Soyad için en fazla 100 karakter girebilirsiniz."),
    email: z.string().min(1, "E-posta adresi gereklidir.").email("Geçerli bir e-posta adresi giriniz."),
    password: z.string().min(1, "Şifre gereklidir.").min(8," Şifre en az 8 karakter uzunluğunda olamalıdır.").regex(/[A-Z]/, "Şifre en az bir büyük harf içermelidir.").regex(/[0-9]/, "Şifre en az 1 rakam içermelidir."),
    confirmPassword: z.string().min(1,"Şifre tekrarı gereklidir."),
})

.refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;