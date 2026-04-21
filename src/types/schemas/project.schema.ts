import z from "zod";

export const ProjectSchema = z.object({
    org_id: z.string().uuid(),
    name: z.string().min(2, 'proje adı en az 2 karakter olmalı'),
    description: z.string().optional(),
    status: z.enum(['active','completed','archived']).default('active'),
    visibility: z.enum(['public','private']).default('private'),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
})

export type Project = z.infer<typeof ProjectSchema>