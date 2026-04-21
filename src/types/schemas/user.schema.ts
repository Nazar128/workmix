import z from "zod";


export const UserSchema = z.object ({
    name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
    email: z.string().email("Geçerli bir email girin."),
    phone: z.string().optional(),
    avatar_url: z.string().url().optional(),
    system_role: z.enum(['admin', 'manager','user']).default('user'),
})

export type User = z.infer<typeof UserSchema>