import z from "zod";

export const OrganizationSchema = z.object ({
    name: z.string().min(2,'Organizasyon adı en az 2 karakter olmalı' ),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Sadece küçük harf, rakam ve tire'),
    plan: z.enum(['free', 'pro','enterprise']).default('free'),
    status: z.enum(['active', 'suspended', 'deleted']).default('active'),
    max_members: z.number().int().positive().default(10),
    max_projects: z.number().int().positive().default(5),
    trial_ens_at: z.string().datetime().optional(),
})

export type Organization = z.infer<typeof OrganizationSchema>